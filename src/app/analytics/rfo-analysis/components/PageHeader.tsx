import React from 'react';
import { Scale, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';

interface PageHeaderProps {
  invalidPercentage: number;
  analysisDate: string;
}

export const PageHeader = React.memo<PageHeaderProps>(({ invalidPercentage, analysisDate }) => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-2xl">
            <Scale className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <Badge variant="outline" className="text-xs font-bold text-red-700 border-red-400 bg-red-50 px-3 py-1">
                CRITICAL MATHEMATICAL ERRORS DETECTED
              </Badge>
              <Badge variant="outline" className="text-xs font-bold text-blue-700 border-blue-400 bg-blue-50 px-3 py-1">
                {invalidPercentage}% Invalid Claims
              </Badge>
            </div>
            <h1 className={`${typography.display.small} text-slate-900 mb-2`}>
              RFO Responsive Declaration
            </h1>
            <p className={`${typography.body.large} text-slate-600 max-w-4xl`}>
              Comprehensive forensic analysis of Petitioner&apos;s Request for Order with detailed mathematical refutations, source citations, and evidence-based counterproposals
            </p>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="text-right">
            <div className={`${typography.caption.large} text-slate-500 mb-1`}>Analysis Date</div>
            <div className={`${typography.body.medium} font-semibold text-slate-800`}>
              {new Date(analysisDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
PageHeader.displayName = 'PageHeader';
