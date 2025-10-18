import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { FilingTask } from '../types';

interface ProgressOverviewProps {
  tasks: FilingTask[];
}

export const ProgressOverview = React.memo<ProgressOverviewProps>(({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  return (
    <Card className="mb-8 bg-gradient-to-br from-white to-blue-50/30 shadow-xl border-slate-200/60">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          Filing Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{completionPercentage}%</div>
            <div className="text-sm text-slate-600">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedTasks}</div>
            <div className="text-sm text-slate-600">Completed Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{inProgressTasks}</div>
            <div className="text-sm text-slate-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{pendingTasks}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProgressOverview.displayName = 'ProgressOverview';
