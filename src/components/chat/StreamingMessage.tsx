'use client';

import { useState, useEffect } from 'react';
import { Copy, RotateCcw, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatTimestamp } from '@/lib/utils';
import { Artifact } from '@/types';
import { ArtifactBlock } from './ArtifactBlock';

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  timestamp: Date;
  artifacts?: Artifact[];
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
}

export function StreamingMessage({
  content,
  isStreaming,
  timestamp,
  artifacts = [],
  onCopy,
  onRegenerate,
  onEdit
}: StreamingMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (isStreaming) {
      setDisplayedContent(content);
    } else {
      setDisplayedContent(content);
    }
  }, [content, isStreaming]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    onCopy?.();
  };

  return (
    <Card className="group relative p-4 bg-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              AI Assistant
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(timestamp)}
            </span>
            {isStreaming && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Thinking...
              </span>
            )}
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">
              {displayedContent}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </div>
          </div>

          {artifacts.length > 0 && (
            <div className="mt-4 space-y-3">
              {artifacts.map((artifact) => (
                <ArtifactBlock key={artifact.id} artifact={artifact} />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRegenerate} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
