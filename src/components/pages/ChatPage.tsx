'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/lib/gemini';
import { generateId } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatMessage[][]>([]);
  const [activeConversation, setActiveConversation] = useState(0);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ChatMessage[][]>([]);

  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      // Convert string timestamps back to Date objects
      const conversationsWithDates = parsed.map((conversation: ChatMessage[]) =>
        conversation.map((message: ChatMessage) => ({
          ...message,
          timestamp: typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp,
        }))
      );
      setConversations(conversationsWithDates);
      if (conversationsWithDates.length > 0) {
        setCurrentMessages(conversationsWithDates[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations));
      setCurrentMessages(conversations[activeConversation] || []);
    }
  }, [conversations, activeConversation]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(conversation =>
        conversation.some(message =>
          message.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [conversations, searchQuery]);

  const handleNewMessage = (message: ChatMessage) => {
    const newConversations = [...conversations];
    if (newConversations[activeConversation]) {
      newConversations[activeConversation] = [...newConversations[activeConversation], message];
    } else {
      newConversations[activeConversation] = [message];
    }
    setConversations(newConversations);
    
    // Update current messages immediately for real-time display
    setCurrentMessages(prev => [...prev, message]);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const newConversations = [...conversations];
    const conversation = newConversations[activeConversation];
    if (conversation) {
      const updatedConversation = conversation.map(msg => 
        msg.id === messageId ? { ...msg, content: newContent } : msg
      );
      newConversations[activeConversation] = updatedConversation;
      setConversations(newConversations);
      
      // Update current messages
      setCurrentMessages(updatedConversation);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    const newConversations = [...conversations];
    const conversation = newConversations[activeConversation];
    if (conversation) {
      const updatedConversation = conversation.filter(msg => msg.id !== messageId);
      newConversations[activeConversation] = updatedConversation;
      setConversations(newConversations);
      
      // Update current messages
      setCurrentMessages(updatedConversation);
    }
  };

  const handleNewConversation = () => {
    const newConversations = [...conversations, []];
    setConversations(newConversations);
    setActiveConversation(newConversations.length - 1);
  };

  const handleSelectConversation = (index: number) => {
    setActiveConversation(index);
  };

  const handleDeleteConversation = (index: number) => {
    const newConversations = conversations.filter((_, i) => i !== index);
    setConversations(newConversations);
    
    if (index === activeConversation) {
      const newActiveIndex = Math.max(0, index - 1);
      setActiveConversation(newActiveIndex);
    } else if (index < activeConversation) {
      setActiveConversation(activeConversation - 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetStorage = () => {
    localStorage.removeItem('chat-conversations');
    setConversations([]);
    setCurrentMessages([]);
    setActiveConversation(0);
    setSearchQuery('');
    setFilteredConversations([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onSearch={handleSearch} onResetStorage={handleResetStorage} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          conversations={searchQuery ? filteredConversations : conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        <main className="flex-1 flex flex-col bg-background">
          <ChatInterface
            messages={currentMessages}
            onNewMessage={handleNewMessage}
            onReply={handleNewMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        </main>
      </div>
    </div>
  );
}
