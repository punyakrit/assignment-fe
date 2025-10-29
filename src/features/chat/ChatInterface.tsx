'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { StreamingMessage } from '@/components/chat/StreamingMessage';
import { StickyHeader } from '@/components/chat/StickyHeader';
import { EnhancedSearchInput } from '@/components/search/EnhancedSearchInput';
import { ChatMessage, Artifact } from '@/types';
import { generateStreamingResponse, generateArtifacts } from '@/lib/api/chat';
import { generateId } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
  onReply?: (parentId: string, content: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function ChatInterface({ 
  messages, 
  onNewMessage, 
  onReply,
  onEditMessage,
  onDeleteMessage
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = async (message?: string) => {
    const messageContent = message || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: messageContent,
      role: 'user',
      timestamp: new Date(),
    };

    onNewMessage(userMessage);
    setCurrentQuestion(messageContent);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      let fullResponse = '';
      const artifacts: Artifact[] = [];

      for await (const token of generateStreamingResponse(messageContent)) {
        fullResponse += token;
        setStreamingContent(fullResponse);
        
        // Generate artifacts as we stream
        if (fullResponse.includes('```')) {
          const newArtifacts = generateArtifacts(fullResponse);
          if (newArtifacts.length > artifacts.length) {
            // Only update if we have new artifacts
          }
        }
      }

      const finalArtifacts = generateArtifacts(fullResponse);
      
      const aiMessage: ChatMessage = {
        id: generateId(),
        content: fullResponse,
        role: 'assistant',
        timestamp: new Date(),
        artifacts: finalArtifacts,
      };

      onNewMessage(aiMessage);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      onNewMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleRegenerate = async (messageId: string) => {
    // Find the user message that prompted this AI response
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.role === 'user') {
        // Remove the current AI response
        const updatedMessages = messages.slice(0, messageIndex);
        // Regenerate
        await handleSubmit(userMessage.content);
      }
    }
  };

  const handleEdit = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const newContent = prompt('Edit message:', message.content);
      if (newContent !== null && newContent.trim() !== message.content) {
        onEditMessage?.(messageId, newContent.trim());
      }
    }
  };

  const handleCopy = () => {
    // Copy functionality is handled in individual message components
  };

  return (
    <div className="flex flex-col h-full">
      <StickyHeader
        question={currentQuestion}
        timestamp={messages.find(m => m.role === 'user')?.timestamp || new Date()}
        isSticky={isSticky}
        onToggleSticky={() => setIsSticky(!isSticky)}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <Card className="p-8 max-w-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Start a conversation
                </h3>
                <p className="text-muted-foreground">
                  Ask me anything! I can help with coding, explain concepts, or just have a chat.
                </p>
              </Card>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <Card className="group relative p-4 bg-primary/5 ml-auto max-w-[80%] border-primary/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-medium text-primary">You</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert text-sm whitespace-pre-wrap">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                          >
                            {message.content || ''}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <StreamingMessage
                    content={message.content}
                    isStreaming={false}
                    timestamp={message.timestamp}
                    artifacts={message.artifacts}
                    onCopy={handleCopy}
                    onRegenerate={() => handleRegenerate(message.id)}
                    onEdit={() => handleEdit(message.id)}
                  />
                )}
              </div>
            ))
          )}

          {isStreaming && (
            <StreamingMessage
              content={streamingContent}
              isStreaming={true}
              timestamp={new Date()}
              artifacts={generateArtifacts(streamingContent)}
              onCopy={handleCopy}
            />
          )}

          {isLoading && !isStreaming && (
            <Card className="p-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto">
          <EnhancedSearchInput
            onSend={handleSubmit}
            placeholder="Ask anything... (Press Enter to send, Shift+Enter for new line)"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
