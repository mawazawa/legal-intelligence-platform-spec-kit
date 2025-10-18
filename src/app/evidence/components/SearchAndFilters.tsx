"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import type { FileType, EvidenceStats } from '@/lib/types/evidence';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: FileType | null;
  onTypeChange: (type: FileType | null) => void;
  stats: EvidenceStats | null;
}

export const SearchAndFilters = React.memo<SearchAndFiltersProps>(({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  stats
}) => {
  return (
    <>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search evidence by title, description, or filename..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedType === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange(null)}
        >
          All Types
        </Button>
        <Button
          variant={selectedType === 'pdf' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('pdf')}
        >
          PDFs ({stats?.by_type.pdf || 0})
        </Button>
        <Button
          variant={selectedType === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('image')}
        >
          Images ({stats?.by_type.image || 0})
        </Button>
        <Button
          variant={selectedType === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('video')}
        >
          Videos ({stats?.by_type.video || 0})
        </Button>
      </div>
    </>
  );
});

SearchAndFilters.displayName = 'SearchAndFilters';
