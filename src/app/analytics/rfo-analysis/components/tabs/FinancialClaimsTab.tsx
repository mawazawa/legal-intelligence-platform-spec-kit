import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RFOAnalysisData } from '../../types';

interface FinancialClaimsTabProps {
  data: RFOAnalysisData;
}

export const FinancialClaimsTab = React.memo<FinancialClaimsTabProps>(({ data }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Financial Claims Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Invalid Claims: ${data.summary.totalInvalidClaims.toLocaleString()}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Mortgage &quot;Add Back&quot;:</span>
                    <span className="font-medium text-red-800">$77,779.88</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Watts Charges (Nov 2024):</span>
                    <span className="font-medium text-red-800">$18,112.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Attorney Fees Sanctions:</span>
                    <span className="font-medium text-red-800">$40,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Cleanup Costs:</span>
                    <span className="font-medium text-red-800">$6,419.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Removal Costs:</span>
                    <span className="font-medium text-red-800">$2,470.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Valid Claims: ${data.summary.totalValidClaims.toLocaleString()}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Watts Charges (2021-2023):</span>
                    <span className="font-medium text-green-800">$46,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Rental Income Share:</span>
                    <span className="font-medium text-green-800">$5,761.81</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Motorcycle Share:</span>
                    <span className="font-medium text-green-800">$5,855.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Household Items:</span>
                    <span className="font-medium text-green-800">$7,500.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Offset Claims Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Petitioner&apos;s Exclusive Use Period</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{data.timeline.daysOfUse}</div>
                  <div className="text-sm text-blue-600">Days of Use</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">6.5</div>
                  <div className="text-sm text-blue-600">Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">${data.timeline.offsetValue.toLocaleString()}</div>
                  <div className="text-sm text-blue-600">Offset Value</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">Watts Charges Offset Calculation</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Petitioner&apos;s Watts Claims:</span>
                  <span className="font-medium text-slate-800">$64,312.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Petitioner&apos;s Use Period:</span>
                  <span className="font-medium text-slate-800">{data.timeline.daysOfUse} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Offset Value:</span>
                  <span className="font-medium text-slate-800">${data.timeline.offsetValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-semibold text-slate-800">Net Watts Charges:</span>
                  <span className="font-bold text-green-600">$35,062.50</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
FinancialClaimsTab.displayName = 'FinancialClaimsTab';
