"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EvidenceHeatmapProps, HeatmapData, ViewMode } from './evidence-heatmap/types';
import {
  transformEvidenceData,
  filterHeatmapData,
  groupHeatmapData,
  extractCategories,
  extractSubcategories,
} from './evidence-heatmap/dataUtils';
import { exportHeatmapToCanvas } from './evidence-heatmap/exportUtils';
import Controls from './evidence-heatmap/Controls';
import HeatmapGrid from './evidence-heatmap/HeatmapGrid';
import Legend from './evidence-heatmap/Legend';
import SelectedCellDetails from './evidence-heatmap/SelectedCellDetails';

const EvidenceHeatmap: React.FC<EvidenceHeatmapProps> = ({
  evidenceData,
  onCellClick
}) => {
  // State management
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [selectedCell, setSelectedCell] = useState<HeatmapData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('strength');
  const [showLabels, setShowLabels] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [filterStrength, setFilterStrength] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initialize data
  useEffect(() => {
    if (!evidenceData) return;
    setHeatmapData(transformEvidenceData(evidenceData));
  }, [evidenceData]);

  // Memoized filtered and grouped data
  const filteredData = useMemo(() =>
    filterHeatmapData(heatmapData, searchTerm, filterStrength, filterCategory),
    [heatmapData, searchTerm, filterStrength, filterCategory]
  );

  const groupedData = useMemo(() =>
    groupHeatmapData(filteredData),
    [filteredData]
  );

  const categories = useMemo(() =>
    extractCategories(filteredData),
    [filteredData]
  );

  const subcategories = useMemo(() =>
    extractSubcategories(filteredData),
    [filteredData]
  );

  // Event handlers
  const handleCellClick = useCallback((data: HeatmapData) => {
    setSelectedCell(data);
    onCellClick?.(data);
  }, [onCellClick]);

  const handleExport = useCallback(() => {
    exportHeatmapToCanvas(categories, subcategories, groupedData, viewMode);
  }, [categories, subcategories, groupedData, viewMode]);

  return (
    <div className="space-y-4">
      <Controls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showLabels={showLabels}
        onShowLabelsChange={setShowLabels}
        showValues={showValues}
        onShowValuesChange={setShowValues}
        filterStrength={filterStrength}
        onFilterStrengthChange={setFilterStrength}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onExport={handleExport}
      />

      <HeatmapGrid
        categories={categories}
        subcategories={subcategories}
        groupedData={groupedData}
        viewMode={viewMode}
        showLabels={showLabels}
        showValues={showValues}
        onCellClick={handleCellClick}
      />

      <Legend viewMode={viewMode} />

      <SelectedCellDetails selectedCell={selectedCell} />
    </div>
  );
};

export default EvidenceHeatmap;
