"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegendProps } from './types';

const Legend: React.FC<LegendProps> = React.memo(({ viewMode }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {viewMode === 'strength' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-600"></div>
                <span>Airtight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-teal-600"></div>
                <span>Strong</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-600"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-sky-600"></div>
                <span>Weak</span>
              </div>
            </>
          )}

          {viewMode === 'category' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span>Petitioner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-600"></div>
                <span>Respondent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-500"></div>
                <span>Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-violet-600"></div>
                <span>Legal</span>
              </div>
            </>
          )}

          {viewMode === 'verified' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-600"></div>
                <span>Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span>Unverified</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

Legend.displayName = 'Legend';

export default Legend;
