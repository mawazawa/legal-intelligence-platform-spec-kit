/**
 * Page Header Component
 * SOLID: Single responsibility for page title and description
 */

import React from 'react';
import { Scale } from 'lucide-react';

export const PageHeader = React.memo(() => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-black text-slate-900 mb-3 flex items-center justify-center">
        <Scale className="h-10 w-10 mr-3 text-blue-600" />
        RFO Opposition Filing Guide
      </h1>
      <p className="text-xl text-slate-600 mb-2">File Your FL-320 Response in Plain English</p>
      <p className="text-sm text-slate-500">San Francisco Superior Court Family Law | 2025 Rules</p>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';
