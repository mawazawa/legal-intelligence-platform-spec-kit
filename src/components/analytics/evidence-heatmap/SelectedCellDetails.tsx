"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { SelectedCellDetailsProps } from './types';

const SelectedCellDetails: React.FC<SelectedCellDetailsProps> = React.memo(({ selectedCell }) => {
  if (!selectedCell) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {selectedCell.evidence[0]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Details</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Category:</strong> {selectedCell.category}</div>
              <div><strong>Subcategory:</strong> {selectedCell.subcategory}</div>
              <div><strong>Strength:</strong> {selectedCell.strength}</div>
              <div><strong>Verified:</strong> {selectedCell.verified ? 'Yes' : 'No'}</div>
              <div><strong>Value:</strong> {selectedCell.value}</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {selectedCell.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SelectedCellDetails.displayName = 'SelectedCellDetails';

export default SelectedCellDetails;
