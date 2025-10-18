"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Target,
  BarChart3,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Search,
  Download,
} from 'lucide-react';
import { ControlsProps } from './types';
import { STRENGTH_OPTIONS, CATEGORY_OPTIONS } from './constants';

const Controls: React.FC<ControlsProps> = React.memo(({
  viewMode,
  onViewModeChange,
  showLabels,
  onShowLabelsChange,
  showValues,
  onShowValuesChange,
  filterStrength,
  onFilterStrengthChange,
  filterCategory,
  onFilterCategoryChange,
  searchTerm,
  onSearchTermChange,
  onExport,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
      {/* View Mode Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'strength' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('strength')}
        >
          <Target className="h-4 w-4" />
          Strength
        </Button>
        <Button
          variant={viewMode === 'category' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('category')}
        >
          <BarChart3 className="h-4 w-4" />
          Category
        </Button>
        <Button
          variant={viewMode === 'timeline' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('timeline')}
        >
          <Calendar className="h-4 w-4" />
          Timeline
        </Button>
        <Button
          variant={viewMode === 'verified' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('verified')}
        >
          <Check className="h-4 w-4" />
          Verified
        </Button>
      </div>

      {/* Display Toggle Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShowLabelsChange(!showLabels)}
        >
          {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Labels
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShowValuesChange(!showValues)}
        >
          {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Values
        </Button>
      </div>

      {/* Filters */}
      <select
        value={filterStrength}
        onChange={(e) => onFilterStrengthChange(e.target.value)}
        className="px-3 py-1 border border-slate-300 rounded text-sm"
      >
        {STRENGTH_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filterCategory}
        onChange={(e) => onFilterCategoryChange(e.target.value)}
        className="px-3 py-1 border border-slate-300 rounded text-sm"
      >
        {CATEGORY_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Export Button */}
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls;
