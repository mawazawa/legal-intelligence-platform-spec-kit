import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';

interface ActionButtonsProps {
  onPrint: () => void;
  onExportPDF: () => void;
}

export const ActionButtons = React.memo<ActionButtonsProps>(({ onPrint, onExportPDF }) => {
  const handleViewDeclaration = () => {
    window.open('/court-filing/rotert-declaration', '_blank');
  };

  return (
    <div className="flex justify-end space-x-4 mb-8 print:hidden">
      <Button
        variant="outline"
        className="border-slate-300"
        onClick={handleViewDeclaration}
      >
        <FileText className="h-4 w-4 mr-2" />
        View Rotert Declaration
      </Button>
      <Button
        variant="outline"
        className="border-slate-300"
        onClick={onExportPDF}
      >
        <Download className="h-4 w-4 mr-2" />
        Export to PDF
      </Button>
      <Button
        onClick={onPrint}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print / Save as PDF
      </Button>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';
