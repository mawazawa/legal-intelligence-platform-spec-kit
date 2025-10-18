import React from 'react';
import { AlertTriangle, CheckCircle, Target, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';
import { RFOAnalysisData } from '../types';

interface ExecutiveSummaryCardsProps {
  summary: RFOAnalysisData['summary'];
  netProceeds: number;
}

export const ExecutiveSummaryCards = React.memo<ExecutiveSummaryCardsProps>(({ summary, netProceeds }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <Badge className="bg-red-600 text-white text-xs">Invalid</Badge>
          </div>
          <div className={`${typography.heading.h2} text-red-900 mb-1`}>
            ${summary.totalInvalidClaims.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`${typography.caption.large} text-red-700 mb-2`}>
            Total Invalid Claims
          </div>
          <div className={`${typography.caption.small} text-red-600`}>
            {summary.invalidPercentage}% of Petitioner&apos;s total claims
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <Badge className="bg-green-600 text-white text-xs">Valid</Badge>
          </div>
          <div className={`${typography.heading.h2} text-green-900 mb-1`}>
            ${summary.totalValidClaims.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`${typography.caption.large} text-green-700 mb-2`}>
            Valid Petitioner Claims
          </div>
          <div className={`${typography.caption.small} text-green-600`}>
            Supported by evidence and law
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-700" />
            </div>
            <Badge className="bg-blue-600 text-white text-xs">Net Position</Badge>
          </div>
          <div className={`${typography.heading.h2} text-blue-900 mb-1`}>
            ${summary.netRespondentPosition.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`${typography.caption.large} text-blue-700 mb-2`}>
            Respondent&apos;s Net Position
          </div>
          <div className={`${typography.caption.small} text-blue-600`}>
            After all valid adjustments
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-200 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-purple-700" />
            </div>
            <Badge className="bg-purple-600 text-white text-xs">Property</Badge>
          </div>
          <div className={`${typography.heading.h2} text-purple-900 mb-1`}>
            ${netProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`${typography.caption.large} text-purple-700 mb-2`}>
            Net Sale Proceeds
          </div>
          <div className={`${typography.caption.small} text-purple-600`}>
            From settlement statement
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
ExecutiveSummaryCards.displayName = 'ExecutiveSummaryCards';
