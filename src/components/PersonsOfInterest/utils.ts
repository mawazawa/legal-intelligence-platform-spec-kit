import { AlertCircle, CheckCircle } from 'lucide-react';

export const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'active':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'critical':
      return <AlertCircle className="h-4 w-4" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return null;
  }
};
