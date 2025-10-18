import React, { memo } from 'react';

export const DocumentFooter = memo(() => {
  return (
    <div className="court-footer mt-16 pt-8 border-t-2 border-slate-300 text-center">
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">LEGAL DISCLAIMER</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mx-auto mb-4">
          This calculation is based on the provided Statement of Decision and supporting documents.
          All figures are derived from official court documents and closing statements.
          This tool is for informational purposes only and should not replace professional legal advice.
          Please consult with your attorney before making any legal decisions based on these calculations.
        </p>
        <div className="text-xs text-slate-500 space-y-1">
          <p>
            <strong>Document Sources:</strong> Final Sellers Closing Statement, Lakeview Mortgage
            Payoff Statement, Statement of Decision
          </p>
          <p>
            <strong>Calculation Date:</strong> {new Date().toLocaleDateString()} |{' '}
            <strong>Version:</strong> 1.0
          </p>
          <p>
            <strong>Generated for:</strong> Wauters v. Alvero |{' '}
            <strong>Court Filing:</strong> FL-320 Declaration
          </p>
        </div>
      </div>
    </div>
  );
});

DocumentFooter.displayName = 'DocumentFooter';
