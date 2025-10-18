/**
 * Status Icon Component
 * DRY: Reusable status indicator with consistent styling
 */

import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { RFOChecklistItem } from '@/types/checklist';

interface StatusIconProps {
  status: RFOChecklistItem['status'];
}

export const StatusIcon = React.memo<StatusIconProps>(({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
});

StatusIcon.displayName = 'StatusIcon';
