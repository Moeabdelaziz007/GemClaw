import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export function useLiveAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    return audioContextRef.current;
  };

  const playNextAudioRef = useRef<() => void>(null);
  
  const playNextAudio = useCallback(() => {
    if (!audioContextRef.current || playbackQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioData = playbackQueueRef.current.shift()!;
    const audioBuffer = audioContextRef.current.createBuffer(1, audioData.length, 24000);
    audioBuffer.getChannelData(0).set(audioData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    const currentTime = audioContextRef.current.currentTime;
    const startTime = Math.max(currentTime, nextPlayTimeRef.current);
    
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;

    source.onended = () => {
      playNextAudioRef.current?.();
    };
  }, []);

  useEffect(() => {
    playNextAudioRef.current = playNextAudio;
  }, [playNextAudio]);

  const isConnectedRef = useRef(false);
  
  const disconnect = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
    setIsConnected(false);
    isConnectedRef.current = false;
    setIsRecording(false);
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const connect = useCallback(async (
    systemInstruction?: string, 
    voiceName: string = "Zephyr", 
    tools?: any[],
    onTranscription?: (text: string, role: 'user' | 'model') => void,
    onToolCall?: (toolCalls: any[]) => Promise<any[]>
  ) => {
    try {
      setError(null);

      // Check for API key selection if window.aistudio is available
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      }

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key not found. Please configure NEXT_PUBLIC_GEMINI_API_KEY.");
      }

      console.log("Connecting to Gemini Multimodal Live API...");
      const ai = new GoogleGenAI({ apiKey });

      const ctx = initAudioContext();
      await ctx.resume();

      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
      mediaStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(ctx.destination);

      const defaultInstruction = "You are Aether Forge, a master AI architect. Your job is to help the user design a new AI agent. Ask them for the agent's name, its personality, and what skills it needs. Be concise and conversational.";

      console.log("Initializing Live Session...");
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
          },
          systemInstruction: systemInstruction || defaultInstruction,
          tools: tools,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.log("Live Session Opened.");
            setIsConnected(true);
            isConnectedRef.current = true;
            setIsRecording(true);
            
            processor.onaudioprocess = (e) => {
              if (!isConnectedRef.current) return;
              try {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  const s = Math.max(-1, Math.min(1, inputData[i]));
                  pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                
                const buffer = new Uint8Array(pcmData.buffer);
                let binary = '';
                for (let i = 0; i < buffer.byteLength; i++) {
                  binary += String.fromCharCode(buffer[i]);
                }
                const base64Data = btoa(binary);

                sessionPromise.then((session) => {
                  session.sendRealtimeInput({
                    media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                  });
                }).catch(err => {
                  console.error("Error sending audio input:", err);
                });
              } catch (err) {
                console.error("Audio processing error:", err);
              }
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log("Live Message Received:", message);
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              const int16Array = new Int16Array(bytes.buffer);
              const float32Array = new Float32Array(int16Array.length);
              for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
              }

              playbackQueueRef.current.push(float32Array);
              if (!isPlayingRef.current) {
                nextPlayTimeRef.current = audioContextRef.current?.currentTime || 0;
                playNextAudio();
              }
            }

            // Handle Transcriptions
            const msg = message as any;
            if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
              onTranscription?.(msg.serverContent.modelTurn.parts[0].text, 'model');
            }
            if (msg.serverContent?.userTurn?.parts?.[0]?.text) {
              onTranscription?.(msg.serverContent.userTurn.parts[0].text, 'user');
            }

            // Handle Tool Calls
            if (message.toolCall?.functionCalls) {
              if (onToolCall) {
                const responses = await onToolCall(message.toolCall.functionCalls);
                sessionPromise.then(session => {
                  session.sendToolResponse({ functionResponses: responses });
                });
              } else {
                const responses: any[] = [];
                for (const call of message.toolCall.functionCalls) {
                  console.log(`Executing tool: ${call.name}`, call.args);
                  responses.push({
                    name: call.name,
                    id: call.id,
                    response: { result: `Successfully executed ${call.name}.` }
                  });
                }
                sessionPromise.then(session => {
                  session.sendToolResponse({ functionResponses: responses });
                });
              }
            }

            if (message.serverContent?.interrupted) {
              playbackQueueRef.current = [];
              isPlayingRef.current = false;
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError(err.message || "An error occurred");
            disconnect();
          },
          onclose: () => {
            disconnect();
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message);
      disconnect();
    }
  }, [disconnect, playNextAudio]);

  useEffect(() => {
    return () => {
      disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [disconnect]);

  return {
    isConnected,
    isRecording,
    error,
    connect,
    disconnect
  };
}
