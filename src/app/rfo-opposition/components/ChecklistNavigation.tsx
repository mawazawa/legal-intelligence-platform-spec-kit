/**
 * Checklist Navigation Component
 * SOLID: Single responsibility for navigation controls
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, XCircle } from 'lucide-react';

interface ChecklistNavigationProps {
  requiredCompleted: number;
  totalRequired: number;
  onBack: () => void;
}

export const ChecklistNavigation = React.memo<ChecklistNavigationProps>(({
  requiredCompleted,
  totalRequired,
  onBack
}) => {
  const isComplete = requiredCompleted >= totalRequired;

  return (
    <div className="mt-6 flex justify-between">
      <Button variant="outline" onClick={onBack}>
        Back to Deadline
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => window.print()}
        >
          Print Checklist
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={!isComplete}
        >
          {!isComplete ? (
            <>
              <XCircle className="h-5 w-5 mr-2" />
              Complete Required Items First
            </>
          ) : (
            <>
              <CheckSquare className="h-5 w-5 mr-2" />
              Ready to File!
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

ChecklistNavigation.displayName = 'ChecklistNavigation';
