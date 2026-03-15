import { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// إعدادات الـ Live API
const MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";

export function useLiveAPI(apiKey: string, onFunctionCall: (call: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    const ai = new GoogleGenAI({ apiKey });

    let session: any = null;

    const connect = async () => {
      try {
        session = await ai.live.connect({
          model: MODEL,
          callbacks: {
            onopen: () => {
              setIsConnected(true);
              console.log("Live API connected");
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle function calls
              if (message.serverContent?.modelTurn?.parts) {
                for (const part of message.serverContent.modelTurn.parts) {
                  if (part.functionCall) {
                    // Pause audio
                    if (audioContextRef.current) audioContextRef.current.suspend();
                    
                    // Call Firebase Bridge
                    try {
                      const response = await fetch('/api/agent/execute', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(part.functionCall)
                      });
                      const result = await response.json();
                      onFunctionCall(result);
                    } catch (err) {
                      console.error("Firebase Bridge error:", err);
                    } finally {
                      // Resume audio
                      if (audioContextRef.current) audioContextRef.current.resume();
                    }
                  }
                }
              }

              // Handle audio response
              if (message.serverContent?.modelTurn?.parts[0]?.inlineData) {
                const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                playAudio(base64Audio);
              }
            },
            onerror: (err) => {
                console.error("Live API error:", err);
                setIsConnected(false);
            },
            onclose: () => {
                setIsConnected(false);
                console.log("Live API disconnected");
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
            },
          },
        });
        sessionRef.current = session;
      } catch (err) {
        console.error("Connection failed:", err);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (session) {
        session.close();
        sessionRef.current = null;
      }
    };
  }, [apiKey, onFunctionCall]);

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

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
    } catch (err) {
      console.error("Microphone access failed:", err);
    }
  };

  const sendAudio = (base64Data: string) => {
    if (sessionRef.current) {
      sessionRef.current.sendRealtimeInput({
        media: { data: base64Data, mimeType: 'audio/webm' }
      });
    }
  };

  return { isConnected, isRecording, startRecording, stopRecording };
}
