import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { ChecklistStats } from './types';

interface ProgressOverviewProps {
  stats: ChecklistStats;
}

export const ProgressOverview = React.memo<ProgressOverviewProps>(({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Completion</span>
              <span>{stats.completionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={stats.completionPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.totalItems}</div>
              <div className="text-sm text-slate-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.checkedItems}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.criticalItems}</div>
              <div className="text-sm text-slate-600">Critical Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.uncheckedCriticalItems}</div>
              <div className="text-sm text-slate-600">Unchecked Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProgressOverview.displayName = 'ProgressOverview';
