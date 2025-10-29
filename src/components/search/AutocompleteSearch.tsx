'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, Lightbulb } from 'lucide-react';
import { SearchSuggestion, generateSearchSuggestions } from '@/lib/gemini';
import { debounce } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AutocompleteSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function AutocompleteSearch({ 
  onSearch, 
  placeholder = "Search conversations..." 
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (searchQuery.trim()) {
      const results = await generateSearchSuggestions(searchQuery);
      setSuggestions(results);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, 300);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch(suggestion.text);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
      setQuery('');
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'recent':
        return <Clock className="h-4 w-4" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'recent':
        return 'secondary';
      case 'trending':
        return 'default';
      case 'suggestion':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <Card
          ref={listRef}
          className="absolute z-50 w-full mt-1 shadow-lg max-h-60 overflow-hidden"
        >
          <ScrollArea className="max-h-60">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-accent'
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="text-muted-foreground">
                  {getIcon(suggestion.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {suggestion.text}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getBadgeVariant(suggestion.category)} className="text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
