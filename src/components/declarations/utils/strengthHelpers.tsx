import React from 'react';
import { CheckCircle2, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export const getStrengthColor = (strength: string): string => {
  switch (strength) {
    case 'airtight': return 'text-green-700 bg-green-100 border-green-300';
    case 'strong': return 'text-blue-700 bg-blue-100 border-blue-300';
    case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'weak': return 'text-red-700 bg-red-100 border-red-300';
    default: return 'text-gray-700 bg-gray-100 border-gray-300';
  }
};

export const getStrengthIcon = (strength: string): React.ReactNode => {
  switch (strength) {
    case 'airtight': return <CheckCircle2 className="h-4 w-4" />;
    case 'strong': return <CheckCircle className="h-4 w-4" />;
    case 'moderate': return <AlertCircle className="h-4 w-4" />;
    case 'weak': return <XCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};
