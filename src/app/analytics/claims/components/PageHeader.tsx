'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';
import { Scale, Sparkles } from 'lucide-react';

export const PageHeader = React.memo(() => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Scale className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <Badge variant="outline" className="text-xs font-semibold text-indigo-700 border-indigo-300 bg-indigo-50">
            AI-Powered Analysis
          </Badge>
        </div>
      </div>
      <h1 className={`${typography.heading.h1} text-slate-900 mb-3`}>
        Claims Analysis
      </h1>
      <p className={`${typography.body.large} text-slate-600 max-w-3xl`}>
        Analyze opposing party claims with evidence-based refutations powered by Graph RAG
      </p>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';
