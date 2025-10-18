import React from 'react';
import { FileText, Info } from 'lucide-react';
import { typography } from '@/styles/typography';
import { TYPE_COLORS } from '../constants';
import { SourceCitation } from '../types';

interface SourceCitationBadgeProps {
  source: SourceCitation;
}

export const SourceCitationBadge = React.memo<SourceCitationBadgeProps>(({ source }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${TYPE_COLORS[source.type]} text-xs font-medium`}>
      <FileText className="h-3 w-3" />
      <span>{source.document}</span>
      {source.page && <span className="opacity-70">• p.{source.page}</span>}
      {source.section && <span className="opacity-70 text-[10px]">({source.section})</span>}
    </div>
  );
});
SourceCitationBadge.displayName = 'SourceCitationBadge';

interface SourcesListProps {
  sources: SourceCitation[];
  title?: string;
}

export const SourcesList = React.memo<SourcesListProps>(({ sources, title = 'Sources' }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className={`${typography.label.small} text-slate-600 mb-2 flex items-center gap-1`}>
        <Info className="h-3 w-3" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, idx) => (
          <SourceCitationBadge key={idx} source={source} />
        ))}
      </div>
    </div>
  );
});
SourcesList.displayName = 'SourcesList';
