import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { QualityCheckItem, ChecklistStats } from './types';

interface QualitySummaryProps {
  stats: ChecklistStats;
  uncheckedCriticalItems: QualityCheckItem[];
}

export const QualitySummary = React.memo<QualitySummaryProps>(({ stats, uncheckedCriticalItems }) => {
  const remainingItems = stats.totalItems - stats.checkedItems;
  const completedCritical = stats.criticalItems - stats.uncheckedCriticalItems;
  const isComplete = stats.uncheckedCriticalItems === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Quality Control Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Completion Status</h4>
              <div className="space-y-1 text-sm">
                <div>Total Items: {stats.totalItems}</div>
                <div>Completed: {stats.checkedItems}</div>
                <div>Remaining: {remainingItems}</div>
                <div>Completion Rate: {stats.completionPercentage.toFixed(1)}%</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Critical Items</h4>
              <div className="space-y-1 text-sm">
                <div>Total Critical: {stats.criticalItems}</div>
                <div>Completed Critical: {completedCritical}</div>
                <div>Remaining Critical: {stats.uncheckedCriticalItems}</div>
                <div className={isComplete ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  Status: {isComplete ? 'Complete' : 'Incomplete'}
                </div>
              </div>
            </div>
          </div>

          {uncheckedCriticalItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Critical Items Remaining</h4>
              <div className="space-y-1">
                {uncheckedCriticalItems.map((item) => (
                  <div key={item.id} className="text-sm text-red-700">
                    • {item.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

QualitySummary.displayName = 'QualitySummary';
