import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RFOAnalysisData, ExParteTimelineItem } from '../../types';

interface TimelineAnalysisTabProps {
  data: RFOAnalysisData;
  exParteTimeline: ExParteTimelineItem[];
}

export const TimelineAnalysisTab = React.memo<TimelineAnalysisTabProps>(({ data, exParteTimeline }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Critical Timeline Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Key Date: November 16, 2024</h4>
              <p className="text-blue-700 text-sm">
                Petitioner took exclusive possession of the Property on this date.
                This fact is critical because Watts charges end on November 15, 2024,
                and all Property-related expenses after this date are Petitioner&apos;s responsibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Before November 16, 2024</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Respondent responsible for mortgage</li>
                  <li>• Respondent responsible for taxes</li>
                  <li>• Respondent responsible for insurance</li>
                  <li>• Watts charges apply</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">After November 16, 2024</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Petitioner responsible for mortgage</li>
                  <li>• Petitioner responsible for taxes</li>
                  <li>• Petitioner responsible for insurance</li>
                  <li>• Watts charges END</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ex Parte Filing Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exParteTimeline.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.filing}</p>
                  <p className="text-sm text-slate-600">{item.date}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    item.impact === 'High' ? 'border-red-300 text-red-700' : 'border-yellow-300 text-yellow-700'
                  }`}
                >
                  {item.impact} Impact
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
TimelineAnalysisTab.displayName = 'TimelineAnalysisTab';
