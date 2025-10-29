'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/utils';

interface StickyHeaderProps {
  question: string;
  timestamp: Date;
  isSticky: boolean;
  onToggleSticky: () => void;
}

export function StickyHeader({ 
  question, 
  timestamp, 
  isSticky, 
  onToggleSticky 
}: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isSticky || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-6 py-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  Question
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(timestamp)}
                </span>
              </div>
              <p className="text-sm font-medium truncate pr-4">
                {question}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSticky}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
