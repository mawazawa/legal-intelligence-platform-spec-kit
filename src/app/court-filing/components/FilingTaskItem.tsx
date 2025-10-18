import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Eye, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { FilingTask } from '../types';

interface FilingTaskItemProps {
  task: FilingTask;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

export const FilingTaskItem = React.memo<FilingTaskItemProps>(({ task, isExpanded, onToggleExpand }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-white" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-white" />;
      case 'review':
        return <Eye className="h-4 w-4 text-white" />;
      default:
        return null;
    }
  };

  const getStatusClasses = () => {
    switch (task.status) {
      case 'completed':
        return 'border-green-500 bg-green-500';
      case 'in_progress':
        return 'border-blue-500 bg-blue-500';
      case 'review':
        return 'border-yellow-500 bg-yellow-500';
      default:
        return 'border-slate-300';
    }
  };

  const getPriorityClasses = () => {
    switch (task.priority) {
      case 'high':
        return 'border-red-300 text-red-700';
      case 'medium':
        return 'border-yellow-300 text-yellow-700';
      default:
        return 'border-green-300 text-green-700';
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleExpand(task.id)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-600" />
            )}
          </button>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${getStatusClasses()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">{task.title}</h3>
            <p className="text-sm text-slate-600">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${getPriorityClasses()}`}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className="text-xs text-slate-600">
            {task.estimatedTime}
          </Badge>
          {task.dueDate && (
            <Badge variant="outline" className="text-xs text-slate-600">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-slate-800 mb-2">Details</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div>Category: <span className="font-medium">{task.category}</span></div>
                <div>Estimated Time: <span className="font-medium">{task.estimatedTime}</span></div>
                {task.dueDate && (
                  <div>Due Date: <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span></div>
                )}
                {task.completedDate && (
                  <div>Completed: <span className="font-medium">{new Date(task.completedDate).toLocaleDateString()}</span></div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-2">Documents</h4>
              <div className="space-y-1">
                {task.documents?.map((doc, index) => (
                  <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    <FileText className="h-3 w-3 inline mr-1" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {task.notes && (
            <div className="mt-4">
              <h4 className="font-medium text-slate-800 mb-2">Notes</h4>
              <p className="text-sm text-slate-600">{task.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

FilingTaskItem.displayName = 'FilingTaskItem';
