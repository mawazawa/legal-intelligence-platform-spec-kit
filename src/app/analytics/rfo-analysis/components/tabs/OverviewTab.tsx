import React, { Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/loading/PageSkeleton';
import { RFOAnalysisData } from '../../types';

interface OverviewTabProps {
  data: RFOAnalysisData;
}

export const OverviewTab = React.memo<OverviewTabProps>(({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Invalid Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              ${data.mathematicalErrors.totalInvalidClaims.toLocaleString()}
            </div>
            <p className="text-xs text-red-600">
              {data.mathematicalErrors.percentage}% of total claims
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Ex Parte Filings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {data.exParteFilings.total}
            </div>
            <p className="text-xs text-blue-600">
              {data.exParteFilings.frequency}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Continuances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {data.continuances.petitionerRequests}/{data.continuances.total}
            </div>
            <p className="text-xs text-purple-600">
              Petitioner requests (67%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {data.communications.respondentResponseTime} days
            </div>
            <p className="text-xs text-green-600">
              vs {data.communications.petitionerResponseTime} days (Petitioner)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Mathematical Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">
              {data.mathematicalErrors.coreError}
            </p>
            <p className="text-red-700 text-sm">
              Petitioner attempts to both deduct and add back the same $77,779.88,
              which is mathematically impossible and invalidates her entire calculation.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Continuance Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Suspense fallback={<ChartSkeleton />}>
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">Continuance Analysis Chart</div>
                    <div className="text-sm text-gray-400">Chart component temporarily disabled</div>
                  </div>
                </div>
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Financial Claims Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Suspense fallback={<ChartSkeleton />}>
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">Financial Analysis Chart</div>
                    <div className="text-sm text-gray-400">Chart component temporarily disabled</div>
                  </div>
                </div>
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
OverviewTab.displayName = 'OverviewTab';
