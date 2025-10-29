'use client';

import { useState } from 'react';
import { Settings, X, Save, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SettingsModalProps {
  onExportData: () => void;
  onImportData: (data: string) => void;
  onClearAllData: () => void;
}

export default function SettingsModal({ onExportData, onImportData, onClearAllData }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    onExportData();
    setIsOpen(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onImportData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setIsOpen(false);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      onClearAllData();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your chat data and preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Data Management</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Conversations
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleImport}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Conversations
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3 text-destructive">Danger Zone</h3>
            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
