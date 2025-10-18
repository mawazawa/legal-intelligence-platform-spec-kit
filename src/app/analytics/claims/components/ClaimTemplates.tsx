'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { typography } from '@/styles/typography';
import { FileText } from 'lucide-react';

interface ClaimTemplatesProps {
  templates: string[];
  onTemplateClick: (template: string) => void;
  loading: boolean;
}

export const ClaimTemplates = React.memo<ClaimTemplatesProps>(({
  templates,
  onTemplateClick,
  loading
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60 mb-8">
      <CardHeader className="pb-4">
        <CardTitle className={`${typography.heading.h4} text-slate-900 flex items-center gap-2`}>
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
          Common Claims to Analyze
        </CardTitle>
        <p className={`${typography.caption.large} text-slate-600 mt-2`}>
          Quick start with these pre-written claim templates
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => onTemplateClick(template)}
              disabled={loading}
              className="group relative text-left h-auto p-4 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <span className={`${typography.caption.small} text-slate-600 group-hover:text-blue-600`}>
                    {index + 1}
                  </span>
                </div>
                <span className={`${typography.body.small} text-slate-700 group-hover:text-blue-900`}>
                  {template}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ClaimTemplates.displayName = 'ClaimTemplates';
