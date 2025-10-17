import React from 'react';
import { PrintButton } from '@/components/case/PrintButton';
import { ResponsiveDeclarationDocument } from '@/components/filings/ResponsiveDeclarationDocument';

const ResponsiveDeclarationPage = () => {
  return (
    <div className="p-6 mx-auto max-w-6xl space-y-6 cv-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Responsive Declaration (FL-320)</h1>
          <p className="text-slate-600 text-sm">Court-ready responsive declaration with evidence citations and exhibit index</p>
        </div>
        <PrintButton />
      </div>
      <ResponsiveDeclarationDocument layout="detailed" showSidebars id="responsive-declaration" />
    </div>
  );
};

export default ResponsiveDeclarationPage;
