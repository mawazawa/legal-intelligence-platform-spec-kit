'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { CaseFile } from '../types';
import { FileCard } from './FileCard';

interface CategoryFolderProps {
  category: string;
  label: string;
  files: CaseFile[];
  isExpanded: boolean;
  selectedFileId?: string;
  onToggle: () => void;
  onFileSelect: (file: CaseFile) => void;
  onFileOpen: (file: CaseFile) => void;
}

export const CategoryFolder = React.memo<CategoryFolderProps>(({
  category,
  label,
  files,
  isExpanded,
  selectedFileId,
  onToggle,
  onFileSelect,
  onFileOpen
}) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left font-medium text-sm text-gray-700 hover:text-gray-900 mb-2"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <Folder className="h-4 w-4" />
        {label}
        <Badge variant="outline" className="ml-auto text-xs">
          {files.length}
        </Badge>
      </button>

      {isExpanded && (
        <div className="space-y-2 ml-6">
          {files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={selectedFileId === file.id}
              onSelect={() => onFileSelect(file)}
              onOpen={() => onFileOpen(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CategoryFolder.displayName = 'CategoryFolder';
