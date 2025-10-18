import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, CheckCircle2, CheckCircle, FileText, Target } from 'lucide-react';
import { DeclarationPoint, EvidenceItem } from '../types';

interface OverviewTabProps {
  declarationPoints: DeclarationPoint[];
  evidenceDatabase: EvidenceItem[];
}

export const OverviewTab = React.memo<OverviewTabProps>(({ declarationPoints, evidenceDatabase }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Case Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-red-700">Petitioner&apos;s Position</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  Petitioner seeks redistribution of escrow proceeds based on mathematical errors and legally unsupportable claims.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-700">Respondent&apos;s Position</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  Respondent demonstrates Petitioner&apos;s claims are mathematically impossible and legally deficient.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Airtight Points</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {declarationPoints.filter(p => p.strength === 'airtight').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Strong Points</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {declarationPoints.filter(p => p.strength === 'strong').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Evidence Items</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {evidenceDatabase.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Verified</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {evidenceDatabase.filter(e => e.verified).length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

OverviewTab.displayName = 'OverviewTab';
