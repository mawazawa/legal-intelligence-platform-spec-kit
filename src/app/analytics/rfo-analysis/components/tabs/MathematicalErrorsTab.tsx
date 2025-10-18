import React from 'react';
import { AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';
import { RFOAnalysisData } from '../../types';
import { SourcesList } from '../SourceCitation';

interface MathematicalErrorsTabProps {
  data: RFOAnalysisData;
}

export const MathematicalErrorsTab = React.memo<MathematicalErrorsTabProps>(({ data }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-50 via-red-100/50 to-pink-50 border-2 border-red-300 shadow-2xl">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-1">
          <div className="bg-white rounded-t-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-600 text-white text-xs font-bold">CRITICAL ERROR</Badge>
                    <Badge variant="outline" className="border-red-400 text-red-700 text-xs">
                      ${data.mathematicalErrors.totalInvalidClaims.toLocaleString()}
                    </Badge>
                  </div>
                  <CardTitle className={`${typography.heading.h2} text-red-900 mb-2`}>
                    {data.mathematicalErrors.coreError}
                  </CardTitle>
                  <p className={`${typography.body.medium} text-red-800`}>
                    {data.mathematicalErrors.detailedExplanation}
                  </p>
                </div>
              </div>
            </CardHeader>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-200 flex items-center justify-center">
                  <span className="text-red-900 text-lg font-bold">✗</span>
                </div>
                <h4 className={`${typography.heading.h5} text-red-900`}>
                  Petitioner&apos;s Impossible Calculation
                </h4>
              </div>
              <div className={`${typography.body.small} text-red-800 space-y-2`}>
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span>1. Net Escrow Proceeds:</span>
                  <span className="font-semibold">${data.propertyDetails.netProceeds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span>2. &quot;Add Back&quot; Request:</span>
                  <span className="font-semibold text-red-700">+$77,779.88</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-300">
                  <span>3. Fictional Total:</span>
                  <span className="font-bold">$358,135.71</span>
                </div>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
                  <p className={`${typography.label.medium} text-red-900 flex items-center gap-2`}>
                    <AlertTriangle className="h-4 w-4" />
                    MATHEMATICALLY IMPOSSIBLE
                  </p>
                  <p className={`${typography.caption.medium} text-red-700 mt-1`}>
                    Cannot both deduct AND add back the same amount
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                </div>
                <h4 className={`${typography.heading.h5} text-green-900`}>
                  Mathematically Correct Calculation
                </h4>
              </div>
              <div className={`${typography.body.small} text-green-800 space-y-2`}>
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span>1. Gross Sale Price:</span>
                  <span className="font-semibold">${data.propertyDetails.salePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span>2. Less: Mortgage Payoff:</span>
                  <span className="font-semibold">-${data.propertyDetails.mortgagePayoff.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span>3. Less: Closing Costs:</span>
                  <span className="font-semibold">-${data.propertyDetails.closingCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-300">
                  <span className="font-semibold">4. Net Proceeds:</span>
                  <span className="font-bold text-green-700">${data.propertyDetails.netProceeds.toLocaleString()}</span>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mt-3">
                  <p className={`${typography.label.medium} text-green-900 flex items-center gap-2`}>
                    <CheckCircle className="h-4 w-4" />
                    MATHEMATICALLY CORRECT
                  </p>
                  <p className={`${typography.caption.medium} text-green-700 mt-1`}>
                    Verified by settlement statement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <SourcesList sources={data.mathematicalErrors.sources} title="Evidence & Documentation" />
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <CardTitle className={`${typography.heading.h3} text-slate-900`}>
                  Invalid Claims Breakdown
                </CardTitle>
                <p className={`${typography.caption.large} text-slate-600 mt-1`}>
                  Detailed analysis of {data.claims.invalid.length} invalid claims totaling ${data.summary.totalInvalidClaims.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`${typography.heading.h2} text-red-600`}>
                ${data.summary.totalInvalidClaims.toLocaleString()}
              </div>
              <div className={`${typography.caption.medium} text-slate-600`}>
                Total Invalid
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.claims.invalid.map((claim, index) => (
              <div
                key={index}
                className="group border-2 border-red-200 rounded-xl p-5 hover:border-red-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-red-50/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className={`${typography.caption.small} font-bold text-red-700`}>
                          {index + 1}
                        </span>
                      </div>
                      <h4 className={`${typography.heading.h5} text-slate-900`}>
                        {claim.description}
                      </h4>
                    </div>
                    <p className={`${typography.body.small} text-red-700 mb-3 ml-9`}>
                      <strong>Reason:</strong> {claim.reason}
                    </p>
                    {claim.calculation && (
                      <div className="ml-9 bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
                        <p className={`${typography.caption.large} text-slate-600 mb-1 font-semibold`}>
                          Calculation Breakdown:
                        </p>
                        <p className={`${typography.caption.medium} text-slate-700 font-mono`}>
                          {claim.calculation}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className={`${typography.heading.h3} text-red-600`}>
                      ${claim.amount.toLocaleString()}
                    </div>
                    <Badge className="bg-red-600 text-white mt-1">Invalid</Badge>
                  </div>
                </div>
                <SourcesList sources={claim.sources} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <CardTitle className={`${typography.heading.h3} text-slate-900`}>
                  Valid Claims (For Comparison)
                </CardTitle>
                <p className={`${typography.caption.large} text-slate-600 mt-1`}>
                  {data.claims.valid.length} valid claims totaling ${data.summary.totalValidClaims.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`${typography.heading.h2} text-green-600`}>
                ${data.summary.totalValidClaims.toLocaleString()}
              </div>
              <div className={`${typography.caption.medium} text-slate-600`}>
                Total Valid
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.claims.valid.map((claim, index) => (
              <div
                key={index}
                className="border-2 border-green-200 rounded-xl p-4 bg-gradient-to-br from-white to-green-50/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className={`${typography.body.medium} font-semibold text-slate-900 mb-1`}>
                      {claim.description}
                    </h5>
                    {claim.calculation && (
                      <p className={`${typography.caption.medium} text-slate-600 font-mono`}>
                        {claim.calculation}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <div className={`${typography.body.large} font-bold text-green-600`}>
                      ${claim.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <SourcesList sources={claim.sources} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
MathematicalErrorsTab.displayName = 'MathematicalErrorsTab';
