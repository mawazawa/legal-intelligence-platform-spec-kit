import React from 'react';
import { Scale as ScaleIcon } from 'lucide-react';

interface ChecklistHeaderProps {
  caseName?: string;
}

export const ChecklistHeader = React.memo<ChecklistHeaderProps>(({
  caseName = "Wauters v. Alvero"
}) => {
  return (
    <div className="court-header text-center mb-12">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center justify-center">
          <ScaleIcon className="h-10 w-10 mr-4 text-blue-600" />
          FL-320 COURT PACKET CHECKLIST
        </h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">
          Responsive Declaration Filing Preparation
        </h2>
        <div className="flex justify-center items-center gap-8 text-sm text-slate-600">
          <div>
            <span className="font-semibold">Case:</span> {caseName}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div>
            <span className="font-semibold">Generated:</span> {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

ChecklistHeader.displayName = 'ChecklistHeader';
