import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Gavel } from 'lucide-react';

export const PageHeader = React.memo(() => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Gavel className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold text-blue-700 border-blue-300 bg-blue-50">
            Court Filing Ready
          </Badge>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">
        FL-320 Responsive Declaration Filing Package
      </h1>
      <p className="text-lg text-slate-600 max-w-3xl">
        Complete single source of truth for filing responsive declaration to Petitioner&apos;s RFO
      </p>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';
