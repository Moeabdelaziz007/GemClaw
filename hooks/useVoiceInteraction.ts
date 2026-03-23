'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export function useVoiceInteraction() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            maxConfidence = Math.max(maxConfidence, event.results[i][0].confidence);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const newTranscript = finalTranscript || interimTranscript;
        setTranscript(newTranscript);
        if (finalTranscript) {
          setConfidence(maxConfidence);
        }
        
        // Sync transcript to SensorySlice per Forge rules
        if (newTranscript) {
           import('../lib/store/useGemclawStore').then(({ useGemclawStore }) => {
             useGemclawStore.getState().setStreamingBuffer(newTranscript);
           });
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
  }, []);

  // Mic Level Processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);

  const startMicLevelTracking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const updateMicLevel = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        // Normalize 0-255 to 0-1
        const level = average / 255;
        
        // Sync to CognitiveSlice
        import('../lib/store/useGemclawStore').then(({ useGemclawStore }) => {
           useGemclawStore.setState({ micLevel: level });
        });

        frameRef.current = requestAnimationFrame(updateMicLevel);
      };
      
      updateMicLevel();
    } catch (err) {
      console.error("Mic level tracking failed:", err);
    }
  };

  const stopMicLevelTracking = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    import('../lib/store/useGemclawStore').then(({ useGemclawStore }) => {
      useGemclawStore.setState({ micLevel: 0 });
    });
  };

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setTranscript('');
        setError(null);
        startMicLevelTracking();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('Failed to start voice recognition');
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        stopMicLevelTracking();
      } catch (err) {
        console.error('Failed to stop recognition:', err);
      }
    }
  }, [recognition, isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicLevelTracking();
    };
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
