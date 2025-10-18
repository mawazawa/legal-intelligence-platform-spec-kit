import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { DeclarationPoint } from '../types';
import { getStrengthColor, getStrengthIcon } from '../utils/strengthHelpers';

interface PetitionerClaimsTabProps {
  points: DeclarationPoint[];
}

export const PetitionerClaimsTab = React.memo<PetitionerClaimsTabProps>(({ points }) => {
  return (
    <div className="space-y-6">
      {points.map((point) => (
        <Card key={point.id} className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-700">{point.title}</span>
              </div>
              <Badge className={getStrengthColor(point.strength)}>
                {getStrengthIcon(point.strength)}
                <span className="ml-1 capitalize">{point.strength}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Petitioner&apos;s Claim:</h4>
              <p className="text-sm text-slate-700">{point.petitionerClaim}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

PetitionerClaimsTab.displayName = 'PetitionerClaimsTab';
