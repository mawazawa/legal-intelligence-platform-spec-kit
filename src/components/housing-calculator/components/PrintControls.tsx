import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Printer } from 'lucide-react';

interface PrintControlsProps {
  onPrint: () => void;
}

export const PrintControls = memo<PrintControlsProps>(({ onPrint }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onPrint}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Print calculation or save as PDF</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onPrint}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Print calculation</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
});

PrintControls.displayName = 'PrintControls';
