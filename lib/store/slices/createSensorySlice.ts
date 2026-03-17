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
    set((state) => ({
      transcript: [
        ...state.transcript,
        {
          id: Math.random().toString(36).substring(7),
          role,
          content,
          timestamp: Date.now(),
        },
      ],
    })),
  setStreamingBuffer: (buffer) => set({ streamingBuffer: buffer }),
  setInterrupted: (interrupted) => set({ isInterrupted: interrupted }),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setVolume: (volume) => set({ volume }),
  setContextUsage: (usage) => set({ contextUsage: usage }),
  clearTranscript: () => set({ transcript: [] }),
});
