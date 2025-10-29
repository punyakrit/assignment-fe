'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Artifact } from '@/types';

interface ArtifactBlockProps {
  artifact: Artifact;
}

export function ArtifactBlock({ artifact }: ArtifactBlockProps) {
  const [isExpanded, setIsExpanded] = useState(artifact.isExpanded || false);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
  };

  const getLanguageColor = (language?: string) => {
    const colors: Record<string, string> = {
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      css: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      html: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[language || 'text'] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className="border border-border/50 bg-muted/30">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            <span className="text-sm font-medium">{artifact.title}</span>
            {artifact.language && (
              <Badge 
                variant="secondary" 
                className={`text-xs ${getLanguageColor(artifact.language)}`}
              >
                {artifact.language}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2">
            {artifact.type === 'code' ? (
              <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                <code className={`language-${artifact.language}`}>
                  {artifact.content}
                </code>
              </pre>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-sm">
                  {artifact.content}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
