import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { Notification } from '@/lib/types/models';

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

export interface InterruptSignal {
  tokenId: string;           // nanoid()
  interruptedAt: number;     // performance.now()
  audioFramesDropped: number;
  lastValidTranscriptChunk: string;
  resolvedAt: number | null;
}

export interface SensorySlice {
  transcript: TranscriptMessage[];
  streamingBuffer: string;
  isInterrupted: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  volume: number;
  contextUsage: number;
  unreadNotifications: Notification[];

  addTranscriptMessage: (role: 'user' | 'agent', content: string) => void;
  addBulkTranscriptMessages: (messages: { role: 'user' | 'agent', content: string }[]) => void;
  setStreamingBuffer: (buffer: string) => void;
  setInterrupted: (interrupted: boolean) => void;
  setIsThinking: (thinking: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setVolume: (volume: number) => void;
  setContextUsage: (usage: number) => void;
  setUnreadNotifications: (notifications: Notification[]) => void;
  clearTranscript: () => void;
}

export const INITIAL_SENSORY_STATE: Pick<SensorySlice, 'transcript' | 'streamingBuffer' | 'isInterrupted' | 'isThinking' | 'isSpeaking' | 'volume' | 'contextUsage' | 'unreadNotifications'> = {
  transcript: [],
  streamingBuffer: '',
  isInterrupted: false,
  isThinking: false,
  isSpeaking: false,
  volume: 0,
  contextUsage: 0,
  unreadNotifications: [],
};

export const createSensorySlice: StateCreator<SensorySlice> = (set, get) => ({
  ...INITIAL_SENSORY_STATE,
  addTranscriptMessage: (role, content) =>
    set((state) => {
      const newMessage = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: Date.now(),
      };
      
      const newTranscript = [...state.transcript, newMessage].slice(-100);
      
      return { transcript: newTranscript };
    }),
  addBulkTranscriptMessages: (messages) =>
    set((state) => {
      const newMessages = messages.map(m => ({
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        ...m,
        timestamp: Date.now(),
      }));
      const newTranscript = [...state.transcript, ...newMessages].slice(-100);
      return { transcript: newTranscript };
    }),
  setStreamingBuffer: (buffer) => set({ streamingBuffer: buffer }),
  setInterrupted: (interrupted) => set({ isInterrupted: interrupted }),
  setIsThinking: (thinking) => set({ isThinking: thinking }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setVolume: (volume) => set({ volume }),
  setContextUsage: (usage) => set({ contextUsage: usage }),
  setUnreadNotifications: (notifications) => set({ unreadNotifications: notifications }),
  clearTranscript: () => set({ transcript: [] }),
});
