export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  parentId?: string;
  replies?: ChatMessage[];
  artifacts?: Artifact[];
  isStreaming?: boolean;
}

export interface Artifact {
  id: string;
  type: 'code' | 'markdown' | 'image' | 'table';
  title: string;
  content: string;
  language?: string;
  isExpanded?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'conversation' | 'message' | 'person';
  highlightedContent?: string;
  timestamp?: Date;
}

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface CommandAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  shortcut?: string;
}
