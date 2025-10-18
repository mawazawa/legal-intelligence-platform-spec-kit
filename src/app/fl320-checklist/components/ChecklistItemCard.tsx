import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { FL320ChecklistItem as ChecklistItem } from '@/types/checklist';
import { getStatusIcon, getPriorityColor, getCategoryIcon } from '../utils/checklist-utils';

interface ChecklistItemCardProps {
  item: ChecklistItem;
  onToggle: (itemId: string) => void;
}

export const ChecklistItemCard = React.memo<ChecklistItemCardProps>(({ item, onToggle }) => {
  return (
    <Card
      className={`border-l-4 ${
        item.status === 'completed' ? 'border-l-green-500 bg-green-50' :
        item.status === 'in-progress' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-gray-300 bg-white'
      } shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <button
              onClick={() => onToggle(item.id)}
              className="mt-1 hover:scale-110 transition-transform duration-200"
              aria-label={`Toggle ${item.title}`}
            >
              {getStatusIcon(item.status)}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCategoryIcon(item.category)}
                  <span className="capitalize">{item.category}</span>
                </Badge>
              </div>
              <p className="text-slate-600 mb-3">{item.description}</p>
              {item.filePath && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <FileText className="h-4 w-4" />
                  <span>{item.filePath}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ChecklistItemCard.displayName = 'ChecklistItemCard';
