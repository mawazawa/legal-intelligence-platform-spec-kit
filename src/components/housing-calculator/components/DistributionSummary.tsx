import React, { memo } from 'react';
import { CalculationSummary } from '../types';

interface DistributionSummaryProps {
  summary: CalculationSummary;
}

export const DistributionSummary = memo<DistributionSummaryProps>(({ summary }) => {
  return (
    <div className="court-calculation mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
          FINAL DISTRIBUTION SUMMARY
        </h3>
        <p className="text-lg font-medium text-slate-700">
          Statement of Decision Allocation with Adjustments
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Alvero Distribution */}
        <div className="bg-slate-50 border-2 border-slate-300 p-6 text-center">
          <h4 className="text-lg font-bold text-slate-800 mb-3">ROSANNA ALVERO</h4>
          <div className="text-4xl font-black text-slate-900 mb-2">
            ${summary.rosannaFinalDistribution.toLocaleString()}
          </div>
          <p className="text-sm text-slate-600 font-medium">
            35% SOD Allocation + Net Adjustments
          </p>
        </div>

        {/* Wauters Distribution */}
        <div className="bg-slate-50 border-2 border-slate-300 p-6 text-center">
          <h4 className="text-lg font-bold text-slate-800 mb-3">MATHIEU WAUTERS</h4>
          <div className="text-4xl font-black text-slate-900 mb-2">
            ${summary.mathieuFinalDistribution.toLocaleString()}
          </div>
          <p className="text-sm text-slate-600 font-medium">
            65% SOD Allocation + Net Adjustments
          </p>
        </div>
      </div>
    </div>
  );
});

DistributionSummary.displayName = 'DistributionSummary';
