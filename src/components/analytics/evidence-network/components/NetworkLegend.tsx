"use client";

import React from 'react';

export const NetworkLegend = React.memo(() => {
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
      <h4 className="font-semibold text-sm mb-2">Legend</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span>Petitioner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
          <span>Respondent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-0.5 bg-red-600"></div>
          <span>Contradicts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-600"></div>
          <span>Supports</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-gray-500"></div>
          <span>Related</span>
        </div>
      </div>
    </div>
  );
});

NetworkLegend.displayName = 'NetworkLegend';
