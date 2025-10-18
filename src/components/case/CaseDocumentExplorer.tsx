"use client";

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FolderTree, ChevronDown, ChevronRight, LinkIcon } from 'lucide-react';
import type { DocumentGroup, CaseDocument } from '@/lib/documents/registry';
import { cn } from '@/lib/utils';

interface CaseDocumentExplorerProps {
  groups: DocumentGroup[];
}

export function CaseDocumentExplorer({ groups }: CaseDocumentExplorerProps) {
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState(() => new Set(groups.map(group => group.id)));

  const filtered = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map(group => ({
        ...group,
        documents: group.documents.filter(doc =>
          (doc.title + doc.tags.join(' ') + (doc.summary ?? '')).toLowerCase().includes(q)
        ),
      }))
      .filter(group => group.documents.length > 0);
  }, [groups, query]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const totalDocuments = groups.reduce((sum, group) => sum + group.documents.length, 0);

  return (
    <Card className="border-0 shadow-sm bg-slate-900 text-slate-100">
      <CardHeader className="space-y-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-blue-300" />
          <CardTitle className="text-lg">Evidence Explorer</CardTitle>
        </div>
        <p className="text-xs text-slate-400">
          Organized, auto-tagged registry of every document used in the financial computation.
        </p>
        <div className="relative">
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Filter documents or tags…"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-200">
            {totalDocuments} files tracked
          </Badge>
          <span>Auto-renamed for readability • Tags generated from context</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {filtered.map(group => {
          const isOpen = openGroups.has(group.id);
          return (
            <div key={group.id} className="rounded-xl border border-slate-800 bg-slate-900/60" id={`doc-group-${group.id}`}>
              <button
                type="button"
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-left',
                  'text-sm font-semibold text-slate-200 hover:bg-slate-800/70 transition-colors'
                )}
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.title}</span>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {isOpen && (
                <div className="border-t border-slate-800">
                  {group.description && (
                    <p className="px-4 py-3 text-[12px] text-slate-400 border-b border-slate-800 bg-slate-900/80">
                      {group.description}
                    </p>
                  )}
                  <div className="space-y-3 p-3">
                    {group.documents.map((doc: CaseDocument) => (
                      <a
                        key={doc.id}
                        id={`doc-${doc.id}`}
                        href={doc.href ?? '#'}
                        className="group block rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-3 transition hover:border-blue-500 hover:bg-slate-800"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                              <LinkIcon className="h-3.5 w-3.5 text-blue-300 opacity-0 group-hover:opacity-100 transition" />
                              {doc.title}
                            </p>
                            {doc.summary && <p className="text-xs text-slate-400 mt-1">{doc.summary}</p>}
                            <p className="text-[11px] text-slate-500 mt-2">{doc.displayPath}</p>
                          </div>
                          <Badge variant="outline" className="border-slate-800 bg-slate-900 text-[10px] text-slate-300">
                            {doc.tags[0]}
                          </Badge>
                        </div>
                        {doc.tags.length > 1 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {doc.tags.slice(1).map(tag => (
                              <span
                                key={tag}
                                className="rounded-full bg-slate-800/80 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-12 text-center text-sm text-slate-500">
            No documents match “{query}”. Try a different tag or keyword such as “Form 593” or “closing statement”.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
