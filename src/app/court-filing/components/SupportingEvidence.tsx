import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { EvidenceItem } from '../types';

interface SupportingEvidenceProps {
  items: EvidenceItem[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const SupportingEvidence = React.memo<SupportingEvidenceProps>(({
  items,
  isVisible,
  onToggleVisibility
}) => {
  const getTypeBadgeClasses = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'document':
        return 'border-blue-300 text-blue-700';
      case 'email':
        return 'border-yellow-300 text-yellow-700';
      case 'calculation':
        return 'border-green-300 text-green-700';
      case 'timeline':
        return 'border-purple-300 text-purple-700';
      default:
        return 'border-slate-300 text-slate-700';
    }
  };

  const getStatusBadgeClasses = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'verified':
        return 'border-green-300 text-green-700';
      case 'pending':
        return 'border-yellow-300 text-yellow-700';
      default:
        return 'border-red-300 text-red-700';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          Supporting Evidence
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="ml-auto"
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVisible && (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-xs ${getTypeBadgeClasses(item.type)}`}>
                      {item.type.replace('_', ' ')}
                    </Badge>
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-600">
                      {item.relevance}% relevance
                    </div>
                    <Badge variant="outline" className={`text-xs ${getStatusBadgeClasses(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-sm text-slate-600 mb-1">
                    <span className="font-medium">Source:</span> {item.source}
                  </div>
                  <div className="text-sm text-slate-600 mb-1">
                    <span className="font-medium">Citation:</span> {item.citation}
                  </div>
                  {item.excerpt && (
                    <div className="text-xs text-slate-500 mt-2 italic">
                      &quot;{item.excerpt}&quot;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SupportingEvidence.displayName = 'SupportingEvidence';
