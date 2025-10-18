import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExportButtons = React.memo(() => {
  return (
    <div className="flex justify-end space-x-4 mt-8">
      <Button
        onClick={() => window.print()}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <FileText className="h-4 w-4 mr-2" />
        Print / Save as PDF
      </Button>
      <Button
        variant="outline"
        className="border-slate-300"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>
    </div>
  );
});
ExportButtons.displayName = 'ExportButtons';
