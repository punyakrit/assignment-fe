'use client';

import { useState } from 'react';
import { Reply, MoreVertical, ThumbsUp, ThumbsDown, Copy, Edit, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '@/lib/gemini';
import { formatTimestamp } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageProps {
  message: ChatMessageType;
  onReply: (parentId: string, content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  depth?: number;
}

export default function Message({ message, onReply, onEdit, onDelete, depth = 0 }: MessageProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(message.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) {
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) {
      setIsLiked(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleEdit = () => {
    if (onEdit) {
      const newContent = prompt('Edit message:', message.content);
      if (newContent !== null && newContent.trim() !== message.content) {
        onEdit(message.id, newContent.trim());
      }
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id);
    }
  };

  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <Card className={`group relative p-4 ${
        message.role === 'user' 
          ? 'bg-primary/5 ml-auto max-w-[80%] border-primary/20' 
          : 'bg-card'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={message.role === 'user' ? 'default' : 'secondary'} className="text-xs">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message.timestamp)}
              </span>
              {message.role === 'user' && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓ Saved
                </span>
              )}
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert text-sm whitespace-pre-wrap">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
              >
                {message.content || ''}
              </ReactMarkdown>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                {message.role === 'user' && onEdit && (
                  <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {message.role === 'user' && onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {canReply && (
          <div className="mt-3">
            <Separator className="mb-3" />
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="h-6 text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={`h-6 text-xs ${isLiked ? 'text-green-600 hover:text-green-700' : ''}`}
              >
                <ThumbsUp className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDislike}
                className={`h-6 text-xs ${isDisliked ? 'text-red-600 hover:text-red-700' : ''}`}
              >
                <ThumbsDown className={`h-3 w-3 mr-1 ${isDisliked ? 'fill-current' : ''}`} />
                {isDisliked ? 'Disliked' : 'Dislike'}
              </Button>
            </div>
          </div>
        )}

        {isReplying && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="resize-none"
              rows={2}
            />
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                size="sm"
                className="text-xs"
              >
                Reply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {message.replies && message.replies.length > 0 && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs h-6"
          >
            {showReplies ? 'Hide' : 'Show'} {message.replies.length} replies
          </Button>
          {showReplies && (
            <div className="mt-2 space-y-2">
              {message.replies.map((reply) => (
                <Message
                  key={reply.id}
                  message={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
