'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface DistributionSummary {
  petitionerClaim: number;
  respondentCorrect: number;
  actualReceived: number;
  difference: number;
}

interface BottomLineSummaryProps {
  summary: DistributionSummary;
  showComparison?: boolean;
}

export default function BottomLineSummary({ summary, showComparison = false }: BottomLineSummaryProps) {
  return (
    <div className="court-calculation mb-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
          DISTRIBUTION SUMMARY
        </h3>
        <p className="text-xl font-medium text-slate-700">
          Bottom Line: What Each Party Receives
        </p>
      </div>

      {/* DISTRIBUTION AMOUNTS */}
      <div className={`grid grid-cols-1 ${showComparison ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
        {/* Petitioner's Claim */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-6 md:p-8 text-center shadow-lg rounded-lg">
          <h4 className="text-lg md:text-xl font-bold text-red-800 mb-4">
            PETITIONER'S CLAIM<br/>
            <span className="text-sm font-normal">(Rosanna Alvero)</span>
          </h4>
          <div className="text-3xl md:text-5xl font-black text-red-900 mb-3">
            ${summary.petitionerClaim.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs md:text-sm text-red-700 font-medium">
            Based on flawed "add-back" calculation
          </p>
          <div className="mt-3 text-xs text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1 inline" />
            <span className="font-bold">Mathematically Impossible</span>
          </div>
        </div>

        {/* Respondent's Correct Calculation */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 md:p-8 text-center shadow-lg rounded-lg">
          <h4 className="text-lg md:text-xl font-bold text-green-800 mb-4">
            RESPONDENT'S CORRECT<br/>
            <span className="text-sm font-normal">(Mathieu Wauters)</span>
          </h4>
          <div className="text-3xl md:text-5xl font-black text-green-900 mb-3">
            ${summary.respondentCorrect.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs md:text-sm text-green-700 font-medium">
            65% of actual net proceeds ($280,355.83)
          </p>
          <div className="mt-3 text-xs text-green-600">
            <CheckCircle2 className="h-4 w-4 mr-1 inline" />
            <span className="font-bold">Court-Ordered 65% Share</span>
          </div>
        </div>

        {/* Difference / What Was Actually Received */}
        {showComparison && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-6 md:p-8 text-center shadow-lg rounded-lg">
            <h4 className="text-lg md:text-xl font-bold text-blue-800 mb-4">
              WINDFALL SOUGHT<br/>
              <span className="text-sm font-normal">(Difference)</span>
            </h4>
            <div className="text-3xl md:text-5xl font-black text-blue-900 mb-3">
              ${summary.difference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs md:text-sm text-blue-700 font-medium">
              Petitioner seeks {((summary.difference / summary.respondentCorrect) * 100).toFixed(1)}% more than entitled
            </p>
            <div className="mt-3 text-xs text-blue-600">
              <DollarSign className="h-4 w-4 mr-1 inline" />
              <span className="font-bold">Additional Amount Claimed</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        <div className="bg-slate-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">${(280355.83).toLocaleString()}</div>
          <div className="text-xs text-slate-600 mt-1">Actual Net Proceeds</div>
        </div>
        <div className="bg-slate-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">65% / 35%</div>
          <div className="text-xs text-slate-600 mt-1">Court-Ordered Split</div>
        </div>
        <div className="bg-slate-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-slate-900">${(77779.88).toLocaleString()}</div>
          <div className="text-xs text-slate-600 mt-1">Arrears Already Paid</div>
        </div>
        <div className="bg-slate-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">Double-Counted</div>
          <div className="text-xs text-slate-600 mt-1">Petitioner's Error</div>
        </div>
      </div>
    </div>
  );
}
