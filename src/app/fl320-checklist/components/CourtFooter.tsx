import React from 'react';

interface CourtFooterProps {
  caseName?: string;
  caseNumber?: string;
}

export const CourtFooter = React.memo<CourtFooterProps>(({
  caseName = "Wauters v. Alvero",
  caseNumber = "FDI-21-794666"
}) => {
  return (
    <div className="court-footer mt-16 pt-8 border-t-2 border-slate-300 text-center">
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">LEGAL DISCLAIMER</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mx-auto mb-4">
          This checklist is for organizational purposes only and should not replace professional legal advice.
          Please consult with your attorney before making any legal decisions or filings.
          All deadlines and requirements should be verified with the court and applicable rules.
        </p>
        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>Case:</strong> {caseName} | <strong>Case Number:</strong> {caseNumber}</p>
          <p><strong>Checklist Date:</strong> {new Date().toLocaleDateString()} | <strong>Version:</strong> 1.0</p>
          <p><strong>Generated for:</strong> FL-320 Responsive Declaration Filing</p>
        </div>
      </div>
    </div>
  );
});

CourtFooter.displayName = 'CourtFooter';
