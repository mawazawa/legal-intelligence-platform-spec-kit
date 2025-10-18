import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface ProgressSummaryProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  totalCount: number;
  progressPercentage: number;
}

export const ProgressSummary = React.memo<ProgressSummaryProps>(({
  completedCount,
  inProgressCount,
  pendingCount,
  totalCount,
  progressPercentage
}) => {
  return (
    <div className="court-calculation mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
          FILING PROGRESS
        </h3>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-4xl font-black text-slate-900">
            {completedCount}/{totalCount}
          </div>
          <div className="text-lg text-slate-600">
            ({progressPercentage.toFixed(1)}% Complete)
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span>{inProgressCount} In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-gray-400" />
            <span>{pendingCount} Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProgressSummary.displayName = 'ProgressSummary';
