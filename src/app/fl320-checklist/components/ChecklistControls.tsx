import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, FileText } from 'lucide-react';

interface ChecklistControlsProps {
  showCompleted: boolean;
  isEditing: boolean;
  onToggleCompleted: () => void;
  onToggleEdit: () => void;
}

export const ChecklistControls = React.memo<ChecklistControlsProps>(({
  showCompleted,
  isEditing,
  onToggleCompleted,
  onToggleEdit
}) => {
  // Fallback icons for test/mocks environments
  const EyeIcon = (Eye as any) || (() => null);
  const EyeOffIcon = (EyeOff as any) || (() => null);

  return (
    <div className="flex gap-2 no-print">
      <Button
        variant="outline"
        onClick={onToggleCompleted}
        className="flex items-center space-x-2"
      >
        {showCompleted ? (
          <>
            <EyeOffIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Hide Completed</span>
            <span className="sm:hidden">Hide</span>
          </>
        ) : (
          <>
            <EyeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Show Completed</span>
            <span className="sm:hidden">Show</span>
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onToggleEdit}
        className="flex items-center space-x-2"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">{isEditing ? 'View' : 'Edit'}</span>
        <span className="sm:hidden">{isEditing ? 'View' : 'Edit'}</span>
      </Button>
    </div>
  );
});

ChecklistControls.displayName = 'ChecklistControls';
