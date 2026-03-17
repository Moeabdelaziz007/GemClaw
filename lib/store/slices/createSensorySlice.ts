import { StateCreator } from 'zustand';

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

export interface SensorySlice {
  transcript: TranscriptMessage[];
  streamingBuffer: string;
  isInterrupted: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  volume: number;
  contextUsage: number;
  addTranscriptMessage: (role: 'user' | 'agent', content: string) => void;
  setStreamingBuffer: (buffer: string) => void;
  setInterrupted: (interrupted: boolean) => void;
  setIsThinking: (thinking: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setVolume: (volume: number) => void;
  setContextUsage: (usage: number) => void;
  clearTranscript: () => void;
}

export const createSensorySlice: StateCreator<SensorySlice> = (set) => ({
  transcript: [],
  streamingBuffer: '',
  isInterrupted: false,
  isThinking: false,
  isSpeaking: false,
  volume: 0,
  contextUsage: 0,
  addTranscriptMessage: (role, content) =>
    set((state) => {
      const newMessage = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: Date.now(),
      };
      
      // Limit transcript to last 100 messages to prevent memory bloat
      const newTranscript = [...state.transcript, newMessage].slice(-100);
      
      return { transcript: newTranscript };
    }),
  setStreamingBuffer: (buffer) => set({ streamingBuffer: buffer }),
  setInterrupted: (interrupted) => set({ isInterrupted: interrupted }),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setVolume: (volume) => set({ volume }),
  setContextUsage: (usage) => set({ contextUsage: usage }),
  clearTranscript: () => set({ transcript: [] }),
});
