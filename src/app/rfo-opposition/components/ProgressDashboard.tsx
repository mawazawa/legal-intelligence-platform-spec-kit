/**
 * Progress Dashboard Component
 * SOLID: Single responsibility for displaying progress metrics
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Circle, AlertTriangle } from 'lucide-react';
import { RFOChecklistItem } from '@/types/checklist';
import { calculateProgress } from '../utils/status-helpers';

interface ProgressDashboardProps {
  checklistItems: RFOChecklistItem[];
  daysUntilDeadline: number | null;
  filingDeadline: Date | null;
}

export const ProgressDashboard = React.memo<ProgressDashboardProps>(({
  checklistItems,
  daysUntilDeadline,
  filingDeadline
}) => {
  const {
    completedCount,
    totalRequired,
    requiredCompleted,
    progressPercentage,
    notStartedCount,
    inProgressCount
  } = calculateProgress(checklistItems);

  return (
    <Card className="shadow-xl border-0 bg-white mb-6">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
        <CardTitle className="text-2xl font-bold flex items-center">
          <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
          Your Filing Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">Required Items Progress</span>
            <span className="text-sm font-bold text-slate-900">{requiredCompleted}/{totalRequired} Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 10 && (
                <span className="text-white text-xs font-bold">{progressPercentage.toFixed(0)}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Not Started</span>
              <Circle className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {notStartedCount}
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-700">In Progress</span>
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">
              {inProgressCount}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700">Completed</span>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">
              {completedCount}
            </div>
          </div>
        </div>

        {/* Deadline Warning */}
        {daysUntilDeadline !== null && daysUntilDeadline < 5 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 mb-1">Urgent: Deadline Approaching!</h4>
              <p className="text-sm text-red-800">
                You have only {daysUntilDeadline} days until your filing deadline ({filingDeadline?.toLocaleDateString()}).
                Focus on required items first. Consider getting professional help if you're running short on time.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProgressDashboard.displayName = 'ProgressDashboard';
