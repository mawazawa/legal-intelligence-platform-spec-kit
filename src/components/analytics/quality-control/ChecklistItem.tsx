import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { QualityCheckItem, QualitySeverity } from './types';
import { getSeverityColor } from './utils';

interface ChecklistItemProps {
  item: QualityCheckItem;
  onToggle: (itemId: string) => void;
}

const getSeverityIcon = (severity: QualitySeverity) => {
  const iconMap: Record<QualitySeverity, React.ReactNode> = {
    critical: <XCircle className="h-4 w-4" />,
    high: <AlertTriangle className="h-4 w-4" />,
    medium: <Info className="h-4 w-4" />,
    low: <CheckCircle2 className="h-4 w-4" />
  };
  return iconMap[severity];
};

export const ChecklistItem = React.memo<ChecklistItemProps>(({ item, onToggle }) => {
  return (
    <Card className="border-l-4 border-l-slate-200">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={item.checked}
            onCheckedChange={() => onToggle(item.id)}
            className="mt-1"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <Badge className={getSeverityColor(item.severity)}>
                  {getSeverityIcon(item.severity)}
                  <span className="ml-1 capitalize">{item.severity}</span>
                </Badge>
                {item.required && (
                  <Badge variant="outline" className="text-xs text-red-600">
                    Required
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-2">{item.description}</p>

            {item.evidence && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                <p className="text-xs text-blue-800">
                  <strong>Evidence:</strong> {item.evidence}
                </p>
              </div>
            )}

            {item.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-xs text-yellow-800">
                  <strong>Notes:</strong> {item.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ChecklistItem.displayName = 'ChecklistItem';
