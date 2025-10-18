'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { typography } from '@/styles/typography';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = React.memo<ErrorDisplayProps>(({ error }) => {
  return (
    <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 mb-8 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-700" />
          </div>
          <div>
            <h3 className={`${typography.heading.h5} text-red-900 mb-2`}>Analysis Error</h3>
            <p className={`${typography.body.medium} text-red-700`}>{error}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';
