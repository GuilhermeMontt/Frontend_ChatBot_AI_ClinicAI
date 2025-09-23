export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'assistant';
}

export interface Chat {
  id: string;
  chat: Message[];
  triage?: any;
  title?: string;
}

export interface ChatResponse {
  reply: string;
}

export interface NewChatResponse {
  id: string;
}