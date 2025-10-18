import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { DeclarationPoint } from '../types';
import { getStrengthColor, getStrengthIcon } from '../utils/strengthHelpers';

interface RespondentRebuttalTabProps {
  points: DeclarationPoint[];
}

export const RespondentRebuttalTab = React.memo<RespondentRebuttalTabProps>(({ points }) => {
  return (
    <div className="space-y-6">
      {points.map((point) => (
        <Card key={point.id} className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700">{point.title}</span>
              </div>
              <Badge className={getStrengthColor(point.strength)}>
                {getStrengthIcon(point.strength)}
                <span className="ml-1 capitalize">{point.strength}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Respondent&apos;s Rebuttal:</h4>
              <p className="text-sm text-slate-700 mb-4">{point.respondentRebuttal}</p>

              <div className="bg-white border border-blue-200 rounded-lg p-3">
                <h5 className="font-semibold text-blue-800 mb-2">Legal Analysis:</h5>
                <p className="text-sm text-slate-700">{point.legalAnalysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

RespondentRebuttalTab.displayName = 'RespondentRebuttalTab';
