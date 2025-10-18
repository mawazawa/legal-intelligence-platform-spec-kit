import React from 'react';
import { Search } from 'lucide-react';

interface DeclarationControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStrength: string;
  onFilterStrengthChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  showOnlyVerified: boolean;
  onShowOnlyVerifiedChange: (value: boolean) => void;
}

export const DeclarationControls = React.memo<DeclarationControlsProps>(({
  searchTerm,
  onSearchChange,
  filterStrength,
  onFilterStrengthChange,
  filterCategory,
  onFilterCategoryChange,
  showOnlyVerified,
  onShowOnlyVerifiedChange
}) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search declarations..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <select
            value={filterStrength}
            onChange={(e) => onFilterStrengthChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Strengths</option>
            <option value="airtight">Airtight</option>
            <option value="strong">Strong</option>
            <option value="moderate">Moderate</option>
            <option value="weak">Weak</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => onFilterCategoryChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="mathematical">Mathematical</option>
            <option value="timeline">Timeline</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="possession">Possession</option>
            <option value="damages">Damages</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyVerified}
              onChange={(e) => onShowOnlyVerifiedChange(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm text-slate-600">Verified Only</span>
          </label>
        </div>
      </div>
    </div>
  );
});

DeclarationControls.displayName = 'DeclarationControls';
