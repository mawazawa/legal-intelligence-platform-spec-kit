/**
 * Checklist Item Card Component
 * SOLID: Single responsibility for rendering individual checklist items
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, HelpCircle, Upload, FileText, Info } from 'lucide-react';
import { RFOChecklistItem } from '@/types/checklist';
import { StatusIcon } from './StatusIcon';
import { getPriorityColor, getStatusBorderColor } from '../utils/status-helpers';

interface ChecklistItemCardProps {
  item: RFOChecklistItem;
  onToggleStatus: (itemId: string) => void;
}

export const ChecklistItemCard = React.memo<ChecklistItemCardProps>(({
  item,
  onToggleStatus
}) => {
  return (
    <Card className={`border-l-4 ${getStatusBorderColor(item.status)} shadow-md hover:shadow-lg transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-start">
          <button
            onClick={() => onToggleStatus(item.id)}
            className="mt-1 mr-4 hover:scale-110 transition-transform"
          >
            <StatusIcon status={item.status} />
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()}
                  </Badge>
                  {item.required && (
                    <Badge className="bg-red-100 text-red-800 border-red-300">REQUIRED</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">{item.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-xs text-slate-500 mb-1">Est. Time</div>
                <div className="text-sm font-semibold text-slate-700">{item.estimatedMinutes} min</div>
              </div>
            </div>

            {/* Plain English Explanation */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-3">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-blue-900 mb-1">Plain English:</h5>
                  <p className="text-sm text-blue-800">{item.plainEnglish}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {item.documentUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(item.documentUrl, '_blank')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Form
                </Button>
              )}
              {item.helpUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(item.helpUrl, '_blank')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help Guide
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload Document
              </Button>

              {/* Special button for property division calculation */}
              {item.id === 'financial-exhibit' && (
                <Link href="/final-distribution" target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Calculation
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ChecklistItemCard.displayName = 'ChecklistItemCard';
