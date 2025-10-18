import { CheckCircle2, Circle, Clock, FileText, User, FolderOpen, FileCheck } from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'form':
      return <FileText className="h-4 w-4" />;
    case 'declaration':
      return <User className="h-4 w-4" />;
    case 'exhibit':
      return <FolderOpen className="h-4 w-4" />;
    default:
      return <FileCheck className="h-4 w-4" />;
  }
};

export const calculateProgress = (items: Array<{ status: string }>) => {
  const completedCount = items.filter(item => item.status === 'completed').length;
  const inProgressCount = items.filter(item => item.status === 'in-progress').length;
  const pendingCount = items.filter(item => item.status === 'pending').length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return {
    completedCount,
    inProgressCount,
    pendingCount,
    totalCount,
    progressPercentage
  };
};
