import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date | string;
  parentId?: string;
  replies?: ChatMessage[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  category: 'recent' | 'suggestion' | 'trending';
}

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate AI response');
  }
};

export const generateSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'How to implement authentication in Next.js?', category: 'suggestion' },
    { id: '2', text: 'Best practices for React state management', category: 'suggestion' },
    { id: '3', text: 'TypeScript advanced patterns', category: 'suggestion' },
    { id: '4', text: 'Next.js performance optimization', category: 'trending' },
    { id: '5', text: 'Modern CSS techniques', category: 'trending' },
  ];

  return suggestions.filter(suggestion => 
    suggestion.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};
