'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Plus, Trash2, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { CommandMenu } from '@/components/ui/command/command-menu';
import { ChatInterface } from '@/features/chat/ChatInterface';
import { ChatMessage, ChatSession } from '@/types';
import { formatTimestamp } from '@/lib/utils';

export default function HomePage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const savedSessions = localStorage.getItem('chat-sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      const sessionsWithDates = parsed.map((session: ChatSession) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((message: ChatMessage) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      }));
      setSessions(sessionsWithDates);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = sessions.filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.messages.some(message =>
          message.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredSessions(filtered);
    } else {
      setFilteredSessions(sessions);
    }
  }, [sessions, searchQuery]);

  const handleNewMessage = (message: ChatMessage) => {
    const newSessions = [...sessions];
    if (newSessions[activeSession]) {
      newSessions[activeSession].messages = [...newSessions[activeSession].messages, message];
      newSessions[activeSession].updatedAt = new Date();
      setSessions(newSessions);
    } else {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: message.content.slice(0, 50),
        messages: [message],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSessions([...sessions, newSession]);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const newSessions = [...sessions];
    const session = newSessions[activeSession];
    if (session) {
      const updatedMessages = session.messages.map(msg =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      );
      newSessions[activeSession].messages = updatedMessages;
      newSessions[activeSession].updatedAt = new Date();
      setSessions(newSessions);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    const newSessions = [...sessions];
    const session = newSessions[activeSession];
    if (session) {
      const updatedMessages = session.messages.filter(msg => msg.id !== messageId);
      newSessions[activeSession].messages = updatedMessages;
      newSessions[activeSession].updatedAt = new Date();
      setSessions(newSessions);
    }
  };

  const handleReply = (parentId: string, content: string) => {
    const replyMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      parentId,
    };
    handleNewMessage(replyMessage);
  };

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newSessions = [...sessions, newSession];
    setSessions(newSessions);
    setActiveSession(newSessions.length - 1);
  };

  const handleSelectSession = (index: number) => {
    setActiveSession(index);
  };

  const handleDeleteSession = (index: number) => {
    const newSessions = sessions.filter((_, i) => i !== index);
    setSessions(newSessions);
    if (activeSession >= newSessions.length) {
      setActiveSession(Math.max(0, newSessions.length - 1));
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      setSessions([]);
      setActiveSession(0);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const currentSession = sessions[activeSession];
  const displaySessions = searchQuery ? filteredSessions : sessions;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">AI Chat</h1>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b bg-background/50">
            <Button
              onClick={handleNewSession}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Recent Conversations
              </h2>
              <div className="space-y-2">
                {displaySessions.map((session, index) => (
                  <Card
                    key={session.id}
                    className={`group relative cursor-pointer transition-all hover:shadow-md border ${
                      activeSession === index
                        ? 'bg-primary text-primary-foreground border-primary/20'
                        : 'hover:bg-accent border-border'
                    }`}
                    onClick={() => handleSelectSession(index)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <MessageCircle className={`h-4 w-4 flex-shrink-0 ${
                            activeSession === index ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium truncate ${
                              activeSession === index ? 'text-primary-foreground' : ''
                            }`}>
                              {session.title}
                            </p>
                            <p className={`text-xs ${
                              activeSession === index ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {session.messages.length} messages • {formatTimestamp(session.updatedAt)}
          </p>
        </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(index);
                          }}
                          className={`h-7 w-7 p-0 transition-all ${
                            activeSession === index 
                              ? 'opacity-70 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive' 
                              : 'opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground'
                          }`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-background">
          {currentSession ? (
            <ChatInterface
              messages={currentSession.messages}
              onNewMessage={handleNewMessage}
              onReply={handleReply}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">Start a new conversation to begin chatting</p>
              </div>
        </div>
          )}
      </main>
      </div>

      {/* Command Menu */}
      <CommandMenu
        onNewChat={handleNewSession}
        onClearHistory={handleClearHistory}
        onSearch={handleSearch}
      />
    </div>
  );
}