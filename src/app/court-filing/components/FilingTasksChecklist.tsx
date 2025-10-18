import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { FilingTask } from '../types';
import { FilingTaskItem } from './FilingTaskItem';

interface FilingTasksChecklistProps {
  tasks: FilingTask[];
  expandedTasks: Set<string>;
  onToggleExpand: (taskId: string) => void;
}

export const FilingTasksChecklist = React.memo<FilingTasksChecklistProps>(({
  tasks,
  expandedTasks,
  onToggleExpand
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Filing Tasks Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <FilingTaskItem
              key={task.id}
              task={task}
              isExpanded={expandedTasks.has(task.id)}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

FilingTasksChecklist.displayName = 'FilingTasksChecklist';
