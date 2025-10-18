/**
 * Deadline Calculator Component
 * SOLID: Single responsibility for calculating and displaying deadlines
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { RFOChecklistItem } from '@/types/checklist';
import { calculateEstimatedTime } from '../utils/status-helpers';

interface DeadlineCalculatorProps {
  hearingDate: string;
  onHearingDateChange: (date: string) => void;
  filingDeadline: Date | null;
  daysUntilDeadline: number | null;
  checklistItems: RFOChecklistItem[];
  onBack: () => void;
  onContinue: () => void;
}

export const DeadlineCalculator = React.memo<DeadlineCalculatorProps>(({
  hearingDate,
  onHearingDateChange,
  filingDeadline,
  daysUntilDeadline,
  checklistItems,
  onBack,
  onContinue
}) => {
  const estimatedHours = calculateEstimatedTime(checklistItems);

  return (
    <Card className="shadow-xl border-0 bg-white mb-6">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
        <CardTitle className="text-2xl font-bold flex items-center">
          <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
          When is Your Hearing?
        </CardTitle>
        <p className="text-slate-600 text-sm mt-2">We'll calculate your filing deadline (9 court days before hearing)</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-w-md">
          <Label htmlFor="hearing-date" className="text-sm font-semibold mb-2 block">Hearing Date</Label>
          <input
            id="hearing-date"
            type="date"
            value={hearingDate}
            onChange={(e) => onHearingDateChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {filingDeadline && daysUntilDeadline !== null && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${daysUntilDeadline < 3 ? 'bg-red-100 border-2 border-red-300' : 'bg-green-100 border-2 border-green-300'}`}>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-slate-700" />
                <span className="text-sm font-semibold text-slate-700">Filing Deadline</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {filingDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${daysUntilDeadline < 3 ? 'bg-red-100 border-2 border-red-300' : 'bg-blue-100 border-2 border-blue-300'}`}>
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-slate-700" />
                <span className="text-sm font-semibold text-slate-700">Days Remaining</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {daysUntilDeadline} days
              </div>
              {daysUntilDeadline < 3 && (
                <Badge className="bg-red-600 text-white mt-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  URGENT
                </Badge>
              )}
            </div>

            <div className="p-4 rounded-lg bg-purple-100 border-2 border-purple-300">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-slate-700" />
                <span className="text-sm font-semibold text-slate-700">Estimated Time</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {estimatedHours} hours
              </div>
            </div>
          </div>
        )}

        {hearingDate && (
          <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              View Your Checklist
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DeadlineCalculator.displayName = 'DeadlineCalculator';
