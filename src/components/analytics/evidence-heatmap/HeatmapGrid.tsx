"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from 'lucide-react';
import { HeatmapGridProps } from './types';
import { getCellColor, getCellIntensity } from './colorUtils';

const HeatmapGrid: React.FC<HeatmapGridProps> = React.memo(({
  categories,
  subcategories,
  groupedData,
  viewMode,
  showLabels,
  showValues,
  onCellClick,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid className="h-5 w-5" />
          Evidence Heatmap - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="flex border-b border-slate-200">
              <div className="w-32 p-2 font-semibold text-sm bg-slate-50"></div>
              {subcategories.map((subcategory) => (
                <div key={subcategory} className="w-24 p-2 text-center font-semibold text-sm bg-slate-50">
                  {subcategory}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {categories.map((category) => (
              <div key={category} className="flex border-b border-slate-200">
                <div className="w-32 p-2 font-semibold text-sm bg-slate-50">
                  {category}
                </div>
                {subcategories.map((subcategory) => {
                  const key = `${category}-${subcategory}`;
                  const groupData = groupedData[key];

                  if (groupData) {
                    const color = getCellColor(groupData.items[0], viewMode);
                    const intensity = getCellIntensity(groupData.items[0], viewMode);

                    return (
                      <div
                        key={subcategory}
                        className="w-24 h-16 p-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: color,
                          opacity: intensity
                        }}
                        onClick={() => onCellClick(groupData.items[0])}
                      >
                        {showLabels && (
                          <div className="text-xs text-white font-semibold text-center">
                            {category}
                          </div>
                        )}
                        {showValues && (
                          <div className="text-xs text-white text-center">
                            {groupData.totalCount}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={subcategory}
                      className="w-24 h-16 p-1 bg-slate-100 border border-slate-200"
                    >
                      <div className="text-xs text-slate-400 text-center">-</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

HeatmapGrid.displayName = 'HeatmapGrid';

export default HeatmapGrid;
