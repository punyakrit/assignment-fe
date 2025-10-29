'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Settings, Moon, Sun, Monitor } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useTheme } from 'next-themes';

interface CommandMenuProps {
  onNewChat: () => void;
  onClearHistory: () => void;
  onSearch: (query: string) => void;
}

export function CommandMenu({ onNewChat, onClearHistory, onSearch }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Chat">
          <CommandItem onSelect={() => runCommand(onNewChat)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Chat</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>N
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onSearch(''))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Conversations</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Data">
          <CommandItem onSelect={() => runCommand(onClearHistory)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Clear History</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto">✓</span>}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto">✓</span>}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto">✓</span>}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
