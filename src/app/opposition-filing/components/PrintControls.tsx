import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface PrintControlsProps {
  onPrint: () => void;
  onOpenComparison: () => void;
}

const PrintControls: React.FC<PrintControlsProps> = ({ onPrint, onOpenComparison }) => {
  return (
    <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
      <Button onClick={onPrint} className="bg-blue-600 hover:bg-blue-700">
        <Printer className="h-4 w-4 mr-2" />
        Print Filing
      </Button>
      <Button variant="outline" onClick={onOpenComparison}>
        <Download className="h-4 w-4 mr-2" />
        Side-by-Side RFO Comparison
      </Button>
    </div>
  );
};

export default React.memo(PrintControls);
