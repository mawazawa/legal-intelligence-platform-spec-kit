import React from 'react';

export const ComparisonContent = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Side-by-Side Comparison</h2>
        <p className="text-slate-600">This tab will show a comparison between the petitioner&apos;s proposed calculation and the respondent&apos;s correct calculation.</p>
      </div>
    </div>
  </div>
));

ComparisonContent.displayName = 'ComparisonContent';
