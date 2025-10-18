"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Printer } from 'lucide-react';
import { QualityCheckItem, QualityControlChecklistProps } from './types';
import { getDefaultChecklistItems } from './checklistData';
import { calculateStats, filterItems, exportChecklistToJSON } from './utils';
import { ProgressOverview } from './ProgressOverview';
import { CategoryFilters } from './CategoryFilters';
import { SearchBar } from './SearchBar';
import { ChecklistItem } from './ChecklistItem';
import { QualitySummary } from './QualitySummary';

const QualityControlChecklist: React.FC<QualityControlChecklistProps> = ({
  evidenceData,
  onChecklistComplete
}) => {
  const [checklistItems, setChecklistItems] = useState<QualityCheckItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize checklist items
  useEffect(() => {
    if (!evidenceData) return;
    setChecklistItems(getDefaultChecklistItems());
  }, [evidenceData]);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(checklistItems), [checklistItems]);

  // Filter items
  const filteredItems = useMemo(
    () => filterItems(checklistItems, activeCategory, searchTerm, showOnlyCritical),
    [checklistItems, activeCategory, searchTerm, showOnlyCritical]
  );

  // Get unchecked critical items
  const uncheckedCriticalItems = useMemo(
    () => checklistItems.filter(item => item.severity === 'critical' && !item.checked),
    [checklistItems]
  );

  // Toggle check item
  const toggleCheckItem = useCallback((itemId: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  }, []);

  // Export handler
  const handleExport = useCallback(() => {
    exportChecklistToJSON(checklistItems, stats);
  }, [checklistItems, stats]);

  // Print handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Notify parent of completion
  useEffect(() => {
    if (onChecklistComplete && stats.completionPercentage === 100) {
      onChecklistComplete(checklistItems);
    }
  }, [stats.completionPercentage, checklistItems, onChecklistComplete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quality Control Checklist</h2>
          <p className="text-slate-600">Comprehensive review of legal document quality and compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <ProgressOverview stats={stats} />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <CategoryFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <label className="flex items-center gap-2">
          <Checkbox
            checked={showOnlyCritical}
            onCheckedChange={setShowOnlyCritical}
          />
          <span className="text-sm text-slate-600">Critical Only</span>
        </label>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={toggleCheckItem}
          />
        ))}
      </div>

      {/* Summary */}
      <QualitySummary
        stats={stats}
        uncheckedCriticalItems={uncheckedCriticalItems}
      />
    </div>
  );
};

export default QualityControlChecklist;
