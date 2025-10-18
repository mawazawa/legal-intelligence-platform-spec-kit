"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { EvidenceNode } from '../types';

interface NodeDetailsProps {
  node: EvidenceNode;
}

const getStrengthIcon = (strength: string) => {
  switch (strength) {
    case 'airtight': return <CheckCircle2 className="h-4 w-4" />;
    case 'strong': return <CheckCircle2 className="h-4 w-4" />;
    case 'moderate': return <AlertCircle className="h-4 w-4" />;
    case 'weak': return <XCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

export const NodeDetails = React.memo<NodeDetailsProps>(({ node }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStrengthIcon(node.strength)}
          {node.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Details</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Type:</strong> {node.type}</div>
              <div><strong>Strength:</strong> {node.strength}</div>
              <div><strong>Verified:</strong> {node.verified ? 'Yes' : 'No'}</div>
              <div><strong>Category:</strong> {node.category}</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {node.tags.map((tag) => (
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

NodeDetails.displayName = 'NodeDetails';
