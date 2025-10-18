import React from 'react';

interface DeclarationsContentProps {
  rfoAttachment7Excerpt: string;
  petitionerDecl: string;
  rosannaFinalDistribution: number;
  mathieuFinalDistribution: number;
}

export const DeclarationsContent = React.memo(({
  rfoAttachment7Excerpt,
  petitionerDecl,
  rosannaFinalDistribution,
  mathieuFinalDistribution
}: DeclarationsContentProps) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Petitioner Declarations (Attorney + Attachment 7) */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-red-800">Petitioner's RFO — Declarations</h2>
          <p className="text-slate-600 text-sm">Attorney declaration and Attachment 7 excerpt, rendered inline.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-semibold text-red-700 mb-2">Attachment 7 — Excerpt</div>
            <div className="bg-red-50 border border-red-200 rounded p-3 max-h-80 overflow-auto">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800">{rfoAttachment7Excerpt || 'RFO not ingested yet.'}</pre>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-red-700 mb-2">Declaration of Selam Gezahegn — Excerpt</div>
            <div className="bg-red-50 border border-red-200 rounded p-3 max-h-80 overflow-auto">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800">{petitionerDecl ? petitionerDecl.slice(0, 2000) : 'Attorney declaration not ingested yet.'}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation context below declarations for immediate comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Final Distribution Summary (For Context)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 text-center">
            <div className="text-xs text-slate-700 mb-1">Rosanna Alvero</div>
            <div className="text-2xl font-black text-slate-900">${rosannaFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 text-center">
            <div className="text-xs text-slate-700 mb-1">Mathieu Wauters</div>
            <div className="text-2xl font-black text-slate-900">${mathieuFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

DeclarationsContent.displayName = 'DeclarationsContent';
