import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DeclarationPoint } from '../types';
import { getStrengthColor, getStrengthIcon } from '../utils/strengthHelpers';

interface EvidenceTabProps {
  points: DeclarationPoint[];
  expandedPoints: Set<string>;
  onTogglePoint: (pointId: string) => void;
}

export const EvidenceTab = React.memo<EvidenceTabProps>(({ points, expandedPoints, onTogglePoint }) => {
  return (
    <div className="space-y-6">
      {points.map((point) => (
        <Card key={point.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>{point.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePoint(point.id)}
              >
                {expandedPoints.has(point.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expandedPoints.has(point.id) && (
              <div className="space-y-4">
                {point.evidence.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStrengthColor(evidence.strength)}>
                          {getStrengthIcon(evidence.strength)}
                          <span className="ml-1 capitalize">{evidence.strength}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {evidence.type}
                        </Badge>
                        {evidence.verified && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{evidence.citation}</span>
                    </div>

                    <h4 className="font-semibold text-slate-800 mb-1">{evidence.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">{evidence.description}</p>

                    <div className="text-xs text-slate-500 mb-2">
                      <strong>Source:</strong> {evidence.source}
                    </div>

                    {evidence.rebuttal && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs text-slate-700">
                          <strong>Rebuttal:</strong> {evidence.rebuttal}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {evidence.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

EvidenceTab.displayName = 'EvidenceTab';
