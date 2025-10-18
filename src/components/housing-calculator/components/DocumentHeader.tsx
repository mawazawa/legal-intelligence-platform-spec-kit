import React, { memo } from 'react';

export const DocumentHeader = memo(() => {
  return (
    <div className="court-header text-center mb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
          HOUSING COST DISTRIBUTION CALCULATION
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mb-4">
          Statement of Decision Implementation
        </h2>
        <div className="flex justify-center items-center gap-8 text-sm text-slate-600">
          <div>
            <span className="font-semibold">Case:</span> Wauters v. Alvero
          </div>
          <div>
            <span className="font-semibold">Date:</span>{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div>
            <span className="font-semibold">Generated:</span>{' '}
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

DocumentHeader.displayName = 'DocumentHeader';
