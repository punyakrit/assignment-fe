'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, AtSign, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { mockSearchResults, mockPeopleSearch } from '@/lib/api/chat';
import { SearchResult, Person } from '@/types';

interface EnhancedSearchInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  className?: string;
}

export function EnhancedSearchInput({ 
  onSend, 
  placeholder = "Ask anything...",
  className = ""
}: EnhancedSearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMentions, setShowMentions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => mockSearchResults(query),
    enabled: query.length > 2 && !showMentions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: peopleResults = [], isLoading: isPeopleLoading } = useQuery({
    queryKey: ['people', query],
    queryFn: () => mockPeopleSearch(query.replace('@', '')),
    enabled: showMentions && query.includes('@'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const allResults = showMentions ? peopleResults : searchResults;
  const isLoading = showMentions ? isPeopleLoading : isSearchLoading;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(0);
    
    if (value.includes('@')) {
      setShowMentions(true);
      setIsOpen(true);
    } else if (value.length > 2) {
      setShowMentions(false);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || allResults.length === 0) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allResults.length) {
          handleSuggestionClick(allResults[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(0);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult | Person) => {
    if ('role' in suggestion) {
      // Person suggestion
      setQuery(prev => prev.replace(/@\w*$/, `@${suggestion.name} `));
    } else if ('title' in suggestion) {
      // Search result
      setQuery(suggestion.title);
    }
    setIsOpen(false);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSend(query.trim());
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <strong key={index}>{part}</strong> : part
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'conversation':
        return <Search className="h-4 w-4" />;
      case 'message':
        return <Search className="h-4 w-4" />;
      case 'person':
        return <AtSign className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'conversation':
        return 'default';
      case 'message':
        return 'secondary';
      case 'person':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 2 && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={placeholder}
            className="pl-10 pr-10 h-12 text-base"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {isOpen && (allResults.length > 0 || isLoading) && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg max-h-80 overflow-hidden">
          <ScrollArea className="max-h-80">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto mb-2" />
                Searching...
              </div>
            ) : (
              <div className="py-2">
                {allResults.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleSuggestionClick(result)}
                    className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="text-muted-foreground">
                      {getIcon('role' in result ? 'person' : result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {'title' in result 
                          ? highlightText(result.title, query.replace('@', ''))
                          : highlightText(result.name, query.replace('@', ''))
                        }
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getBadgeVariant('role' in result ? 'person' : result.type)} className="text-xs">
                          {'role' in result ? result.role : result.type}
                        </Badge>
                        {!('role' in result) && result.timestamp && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(result.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="h-3 w-3 text-muted-foreground" />
                      <ArrowDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
