'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, AlertCircle, Wand2 } from 'lucide-react';

interface ExplorerHeaderProps {
  filesNeedingReview: number;
  onAutoTag: () => void;
}

export const ExplorerHeader = React.memo<ExplorerHeaderProps>(({
  filesNeedingReview,
  onAutoTag
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-lg">Case File Explorer</h2>
        </div>
        <div className="flex items-center gap-2">
          {filesNeedingReview > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              {filesNeedingReview} need review
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={onAutoTag} className="text-xs">
            <Wand2 className="h-3 w-3 mr-1" />
            Auto-Tag
          </Button>
        </div>
      </div>
    </div>
  );
});

ExplorerHeader.displayName = 'ExplorerHeader';
