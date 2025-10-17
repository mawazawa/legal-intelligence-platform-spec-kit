"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ComparisonPoint {
  id: string;
  title: string;
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: string[];
  status: 'disputed' | 'conceded' | 'neutral';
  pageRefs: {
    petitioner: string;
    respondent: string;
  };
}

interface ComparisonViewProps {
  comparisonPoints: ComparisonPoint[];
}

const ComparisonView = React.memo<ComparisonViewProps>(({ comparisonPoints }) => {
  const [expandedPoints, setExpandedPoints] = useState<Set<string>>(new Set());

  const togglePoint = (pointId: string) => {
    setExpandedPoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pointId)) {
        newSet.delete(pointId);
      } else {
        newSet.add(pointId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disputed':
        return <Badge variant="destructive" className="text-xs">DISPUTED</Badge>;
      case 'conceded':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">CONCEDED</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">NEUTRAL</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disputed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'conceded':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div
      role="tabpanel"
      id="comparison-tabpanel"
      aria-labelledby="comparison-tab"
      className="space-y-6"
    >
      {/* Executive Summary */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            EXECUTIVE SUMMARY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <h4 className="font-semibold text-red-700 mb-2">PETITIONER&apos;S CLAIM</h4>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                Petitioner claims Respondent owes additional amounts by adding back $77,779.88 mortgage
                arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35.
              </p>
              <div className="text-xs text-slate-600 bg-red-100 p-3 rounded">
                <strong>Petitioner&apos;s Calculation:</strong><br/>
                • Net proceeds: $358,155.71 (with add-back)<br/>
                • Petitioner (35%): $116,453.00<br/>
                • Respondent (65%): $163,902.83<br/>
                • Plus additional Watts charges and interest
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">RESPONDENT&apos;S REBUTTAL</h4>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                Respondent argues that mortgage arrears were already paid from sale proceeds and cannot be
                double-counted. The correct calculation should use actual net proceeds of $280,355.83.
              </p>
              <div className="text-xs text-slate-600 bg-blue-100 p-3 rounded">
                <strong>Respondent&apos;s Calculation:</strong><br/>
                • Net proceeds: $280,355.83 (actual)<br/>
                • Petitioner (35%): $98,124.54<br/>
                • Respondent (65%): $182,231.29<br/>
                • Plus Statement of Decision adjustments
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Points */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700">DETAILED COMPARISON BY ISSUE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonPoints.map((point) => (
              <div key={point.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    {getStatusIcon(point.status)}
                    {point.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(point.status)}
                    <button
                      onClick={() => togglePoint(point.id)}
                      className="text-xs px-2 py-1 border rounded hover:bg-slate-50"
                    >
                      {expandedPoints.has(point.id) ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <h5 className="text-sm font-semibold text-red-700 mb-2">PETITIONER&apos;S CLAIM</h5>
                    <p className="text-xs text-slate-700">{point.petitionerClaim}</p>
                    <div className="text-xs text-slate-500 mt-2">
                      <strong>Reference:</strong> {point.pageRefs.petitioner}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h5 className="text-sm font-semibold text-blue-700 mb-2">RESPONDENT&apos;S REBUTTAL</h5>
                    <p className="text-xs text-slate-700">{point.respondentRebuttal}</p>
                    <div className="text-xs text-slate-500 mt-2">
                      <strong>Reference:</strong> {point.pageRefs.respondent}
                    </div>
                  </div>
                </div>

                {expandedPoints.has(point.id) && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <h5 className="text-sm font-semibold text-slate-700 mb-2">EVIDENCE</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {point.evidence.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
ComparisonView.displayName = 'ComparisonView';

export default ComparisonView;
