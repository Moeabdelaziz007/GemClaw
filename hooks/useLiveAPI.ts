import { useEffect, useRef, useState } from 'react';

const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

export function useLiveAPI(apiKey: string, onFunctionCall: (call: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<{ id: string; text: string; type: 'system' | 'user' | 'agent' | 'tool'; timestamp: string }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const addLog = (text: string, type: 'system' | 'user' | 'agent' | 'tool') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { id: Math.random().toString(36).substring(7), text, type, timestamp }]);
  };

  const connect = (systemInstruction?: string, voiceName: string = "Zephyr", tools?: any[]) => {
    if (!apiKey) return;
    
    addLog("Initializing neural connection...", "system");
    
    // Endpoint: Ensure the WebSocket connects exactly to the v1beta BidiGenerateContent endpoint
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      addLog("Live API connected successfully.", "system");
      
      // Initial Setup: Send BidiGenerateContentSetup JSON object
      ws.send(JSON.stringify({
        setup: {
          model: MODEL,
          systemInstruction: systemInstruction ? {
            parts: [{ text: systemInstruction }]
          } : undefined,
          tools: tools && tools.length > 0 ? tools : undefined,
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } }
            }
          }
        }
      }));
    };

    ws.onmessage = async (event) => {
      try {
        let data = event.data;
        if (data instanceof Blob) {
          data = await data.text();
        }
        const message = JSON.parse(data);
        
        // Listen for serverMessage.toolCall
        if (message.toolCall) {
          const functionCalls = message.toolCall.functionCalls;
          if (functionCalls) {
            for (const call of functionCalls) {
              addLog(`Executing tool: ${call.name}`, "tool");
              // Pause the audio stream contextually
              if (audioContextRef.current) audioContextRef.current.suspend();
              
              try {
                // Send the tool execution request to our Firebase API route
                const response = await fetch('/api/agent/execute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(call)
                });
                const result = await response.json();
                
                addLog(`Tool ${call.name} executed successfully.`, "tool");
                // Update the VoiceAgent state to render the UI Widget
                onFunctionCall(result);

                // Crucially: Send back a toolResponse
                ws.send(JSON.stringify({
                  toolResponse: {
                    functionResponses: [{
                      id: call.id,
                      name: call.name,
                      response: result
                    }]
                  }
                }));
              } catch (err) {
                console.error("Firebase Bridge error:", err);
                addLog(`Error executing tool ${call.name}`, "system");
              } finally {
                // Resume audio
                if (audioContextRef.current) audioContextRef.current.resume();
              }
            }
          }
        }

        // Handle audio response
        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            if (part.inlineData) {
              playAudio(part.inlineData.data);
            }
          }
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("Live API error:", err);
      addLog("Connection error occurred.", "system");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      addLog("Connection closed.", "system");
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    addLog("Disconnected.", "system");
  };

  const playAudio = async (base64Data: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const audioContext = audioContextRef.current;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const audioBuffer = await audioContext.decodeAudioData(binaryData.buffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const sendAudio = (base64Data: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Streaming Audio: Use the updated schema
      wsRef.current.send(JSON.stringify({
        realtimeInput: {
          audio: {
            mimeType: 'audio/webm',
            data: base64Data
          }
        }
      }));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            sendAudio(base64data);
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorder.start(100); // Send data every 100ms
      setIsRecording(true);
      addLog("Microphone active. Listening...", "user");
    } catch (err) {
      console.error("Microphone access failed:", err);
      addLog("Microphone access denied.", "system");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addLog("Microphone muted.", "user");
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { isConnected, isRecording, logs, connect, disconnect, startRecording, stopRecording };
}

