"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface NetworkControlsProps {
  showLabels: boolean;
  showEdges: boolean;
  filterType: string;
  filterStrength: string;
  onToggleLabels: () => void;
  onToggleEdges: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onExport: () => void;
  onFilterTypeChange: (type: string) => void;
  onFilterStrengthChange: (strength: string) => void;
}

export const NetworkControls = React.memo<NetworkControlsProps>(({
  showLabels,
  showEdges,
  filterType,
  filterStrength,
  onToggleLabels,
  onToggleEdges,
  onZoomIn,
  onZoomOut,
  onReset,
  onExport,
  onFilterTypeChange,
  onFilterStrengthChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleLabels}>
          {showLabels ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Labels
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleEdges}>
          {showEdges ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Edges
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <select
        value={filterType}
        onChange={(e) => onFilterTypeChange(e.target.value)}
        className="px-3 py-1 border border-slate-300 rounded text-sm"
      >
        <option value="all">All Types</option>
        <option value="petitioner">Petitioner</option>
        <option value="respondent">Respondent</option>
        <option value="neutral">Neutral</option>
      </select>

      <select
        value={filterStrength}
        onChange={(e) => onFilterStrengthChange(e.target.value)}
        className="px-3 py-1 border border-slate-300 rounded text-sm"
      >
        <option value="all">All Strengths</option>
        <option value="airtight">Airtight</option>
        <option value="strong">Strong</option>
        <option value="moderate">Moderate</option>
        <option value="weak">Weak</option>
      </select>

      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
});

NetworkControls.displayName = 'NetworkControls';
