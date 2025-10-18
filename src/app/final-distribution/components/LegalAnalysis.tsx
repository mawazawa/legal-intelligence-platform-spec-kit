import React from 'react';
import { SOD_CITATIONS } from '../data/legal-citations';

export const LegalAnalysis = React.memo(() => (
  <div className="space-y-6">
    {Object.entries(SOD_CITATIONS).map(([key, citation]) => (
      <div key={key} className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-2">{citation.title}</h4>
        <p className="text-sm text-slate-600 mb-2">&quot;{citation.text}&quot;</p>
        <div className="text-xs text-slate-500">
          <strong>Relevance:</strong> {citation.relevance}
        </div>
      </div>
    ))}
  </div>
));

LegalAnalysis.displayName = 'LegalAnalysis';
