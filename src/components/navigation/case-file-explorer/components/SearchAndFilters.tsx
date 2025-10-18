'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle } from 'lucide-react';
import { CATEGORY_OPTIONS, FILE_TYPE_OPTIONS } from '../constants';

interface SearchAndFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  selectedType: string;
  filesWithAutoTagging: number;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
}

export const SearchAndFilters = React.memo<SearchAndFiltersProps>(({
  searchQuery,
  selectedCategory,
  selectedType,
  filesWithAutoTagging,
  onSearchChange,
  onCategoryChange,
  onTypeChange
}) => {
  return (
    <>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search files, tags, or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-xs px-2 py-1 border rounded"
        >
          {CATEGORY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="text-xs px-2 py-1 border rounded"
        >
          {FILE_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Auto-tagging status */}
      {filesWithAutoTagging > 0 && (
        <div className="text-xs text-gray-600 mb-2">
          <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
          {filesWithAutoTagging} files auto-tagged
        </div>
      )}
    </>
  );
});

SearchAndFilters.displayName = 'SearchAndFilters';
