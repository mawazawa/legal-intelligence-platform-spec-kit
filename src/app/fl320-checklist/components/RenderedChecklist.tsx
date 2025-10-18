import React from 'react';
import { FileText } from 'lucide-react';

interface RenderedChecklistProps {
  markdownContent: string;
}

export const RenderedChecklist = React.memo<RenderedChecklistProps>(({ markdownContent }) => {
  return (
    <div className="court-calculation mb-12">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-blue-600" />
        RENDERED CHECKLIST
      </h3>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">
          {markdownContent}
        </pre>
      </div>
    </div>
  );
});

RenderedChecklist.displayName = 'RenderedChecklist';
