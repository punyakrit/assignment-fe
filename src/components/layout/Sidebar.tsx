'use client';

import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import { ChatMessage } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  conversations: ChatMessage[][];
  activeConversation: number;
  onSelectConversation: (index: number) => void;
  onNewConversation: () => void;
  onDeleteConversation: (index: number) => void;
}

export default function Sidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <aside className="w-80 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b bg-background/50">
        <Button
          onClick={onNewConversation}
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
            {conversations.map((conversation, index) => (
              <Card
                key={index}
                className={`group relative cursor-pointer transition-all hover:shadow-md border ${
                  activeConversation === index
                    ? 'bg-primary text-primary-foreground border-primary/20'
                    : 'hover:bg-accent border-border'
                }`}
                onClick={() => onSelectConversation(index)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <MessageCircle className={`h-4 w-4 flex-shrink-0 ${
                        activeConversation === index ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${
                          activeConversation === index ? 'text-primary-foreground' : ''
                        }`}>
                          {conversation[0]?.content.slice(0, 50) || 'New Conversation'}
                        </p>
                        <p className={`text-xs ${
                          activeConversation === index ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {conversation.length} messages
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(index);
                      }}
                      className={`h-7 w-7 p-0 transition-all ${
                        activeConversation === index 
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
  );
}
