'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import RotertDeclarationDocument from '@/components/filings/RotertDeclarationDocument';

const RotertDeclaration: React.FC = () => {
  const printDeclaration = () => {
    window.print();
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export functionality
  };

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">THOMAS J. ROTERT DECLARATION</h1>
          <div className="flex justify-center gap-4 print:hidden">
            <Button
              variant="outline"
              onClick={exportToPDF}
              className="border-slate-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
            <Button
              onClick={printDeclaration}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print / Save as PDF
            </Button>
          </div>
        </div>

        <RotertDeclarationDocument />
      </div>
    </div>
  );
};

export default RotertDeclaration;
