export interface Notification {
  id: string;
  userId: string;
  read: boolean;
  message?: string;
  title?: string;
  createdAt?: any;
  type?: string;
}

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}
