"use client";

import React from 'react';

export const DistributionSummary = React.memo(() => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">BOTTOM LINE DISTRIBUTION</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-bold text-red-800 mb-2">PETITIONER'S CALCULATION</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Net Proceeds (with add-back):</span>
              <span className="font-mono font-bold">$358,155.71</span>
            </div>
            <div className="flex justify-between">
              <span>Petitioner (35%):</span>
              <span className="font-mono font-bold text-red-700">$116,453.00</span>
            </div>
            <div className="flex justify-between">
              <span>Respondent (65%):</span>
              <span className="font-mono font-bold text-red-700">$163,902.83</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="font-mono">$280,355.83</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-2">RESPONDENT'S CALCULATION</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Net Proceeds (actual):</span>
              <span className="font-mono font-bold">$280,355.83</span>
            </div>
            <div className="flex justify-between">
              <span>Petitioner (35%):</span>
              <span className="font-mono font-bold text-blue-700">$98,124.54</span>
            </div>
            <div className="flex justify-between">
              <span>Respondent (65%):</span>
              <span className="font-mono font-bold text-blue-700">$182,231.29</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="font-mono">$280,355.83</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800 font-semibold">
          <strong>DISCREPANCY:</strong> Petitioner's calculation inflates her share by $18,328.46
          and reduces Respondent's share by $18,328.46 through improper "add-back" methodology.
        </p>
      </div>
    </div>
  );
});

DistributionSummary.displayName = 'DistributionSummary';
