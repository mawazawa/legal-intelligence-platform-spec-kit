import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface DeclarationHeaderProps {
  onPrint: () => void;
}

export const DeclarationHeader = React.memo<DeclarationHeaderProps>(({ onPrint }) => {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Side-by-Side Declarations</h1>
            <p className="text-slate-600">Petitioner Alvero vs. Respondent Wauters - Granular Evidence Analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onPrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

DeclarationHeader.displayName = 'DeclarationHeader';
