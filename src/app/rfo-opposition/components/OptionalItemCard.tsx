/**
 * Optional Item Card Component
 * SOLID: Specialized component for optional checklist items
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { RFOChecklistItem } from '@/types/checklist';
import { StatusIcon } from './StatusIcon';
import { getOptionalBorderColor } from '../utils/status-helpers';

interface OptionalItemCardProps {
  item: RFOChecklistItem;
  onToggleStatus: (itemId: string) => void;
}

export const OptionalItemCard = React.memo<OptionalItemCardProps>(({
  item,
  onToggleStatus
}) => {
  return (
    <Card className={`${getOptionalBorderColor()} border-l-4 shadow-md hover:shadow-lg transition-all mb-4`}>
      <CardContent className="p-6">
        <div className="flex items-start">
          <button
            onClick={() => onToggleStatus(item.id)}
            className="mt-1 mr-4 hover:scale-110 transition-transform"
          >
            <StatusIcon status={item.status} />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
              <Badge className="bg-gray-100 text-gray-700 border-gray-300">OPTIONAL</Badge>
            </div>
            <p className="text-sm text-slate-600 mb-2">{item.description}</p>

            {/* Plain English */}
            <div className="bg-gray-50 border-l-4 border-gray-300 p-3 rounded mb-3">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 mb-1">Plain English:</h5>
                  <p className="text-sm text-gray-700">{item.plainEnglish}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptionalItemCard.displayName = 'OptionalItemCard';
