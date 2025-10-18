'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';
import { Scale, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import { ClaimAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: ClaimAnalysis;
  query: string;
}

export const AnalysisResults = React.memo<AnalysisResultsProps>(({ analysis, query }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-2xl border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
          <div className="bg-white rounded-t-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`${typography.heading.h3} text-slate-900 mb-1`}>
                    Analysis Complete
                  </h3>
                  <p className={`${typography.caption.large} text-slate-600`}>
                    AI-powered evidence analysis with Graph RAG
                  </p>
                </div>
              </div>
            </CardHeader>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h4 className={`${typography.heading.h6} text-slate-800 mb-3 flex items-center gap-2`}>
                <Scale className="h-4 w-4 text-blue-600" />
                Claim Under Analysis:
              </h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-4">
                <p className={`${typography.body.medium} text-slate-800 italic`}>
                  &quot;{analysis.claim || query}&quot;
                </p>
              </div>
            </div>

            <div>
              <h4 className={`${typography.heading.h6} text-slate-800 mb-3 flex items-center gap-2`}>
                <FileText className="h-4 w-4 text-green-600" />
                Evidence-Based Response:
              </h4>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-inner">
                <p className={`${typography.body.medium} text-slate-700 whitespace-pre-wrap leading-relaxed`}>
                  {analysis.answer}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-2 border-slate-200">
              <div className="text-center p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <div className={`${typography.heading.h2} text-blue-600 mb-1`}>
                  {analysis.metadata.totalResults}
                </div>
                <div className={`${typography.caption.medium} text-slate-600`}>
                  Evidence Sources
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-green-50/50 border border-green-200">
                <div className={`${typography.heading.h2} text-green-600 mb-1`}>
                  {analysis.metadata.sources.length}
                </div>
                <div className={`${typography.caption.medium} text-slate-600`}>
                  Document Types
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                <div className={`${typography.heading.h2} text-purple-600 mb-1`}>
                  {analysis.metadata.processingTime}ms
                </div>
                <div className={`${typography.caption.medium} text-slate-600`}>
                  Processing Time
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Sources */}
      <EvidenceSourcesList evidence={analysis.evidence} />

      {/* Graph Context */}
      {analysis.graphContext && analysis.graphContext.nodes.length > 0 && (
        <GraphContextCard graphContext={analysis.graphContext} />
      )}
    </div>
  );
});

const EvidenceSourcesList = React.memo<{ evidence: ClaimAnalysis['evidence'] }>(({ evidence }) => (
  <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
    <CardHeader className="pb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className={`${typography.heading.h3} text-slate-900 mb-1`}>
            Supporting Evidence
          </h3>
          <p className={`${typography.caption.large} text-slate-600`}>
            {evidence.length} relevant sources found
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {evidence.map((item, index) => (
          <div
            key={item.id}
            className="group border-2 border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className={`${typography.caption.small} font-bold text-blue-700`}>
                    {index + 1}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${
                    item.similarity > 0.8
                      ? 'border-green-400 text-green-700 bg-green-50'
                      : item.similarity > 0.6
                      ? 'border-yellow-400 text-yellow-700 bg-yellow-50'
                      : 'border-red-400 text-red-700 bg-red-50'
                  }`}
                >
                  {Math.round(item.similarity * 100)}% relevance
                </Badge>
              </div>
              <div className={`${typography.caption.medium} text-slate-500 bg-slate-100 px-3 py-1 rounded-full`}>
                {item.source}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-lg p-4 mb-3">
              <p className={`${typography.body.small} text-slate-700 italic leading-relaxed`}>
                &quot;{item.content}&quot;
              </p>
            </div>

            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <details className="group/details">
                  <summary className={`${typography.caption.medium} text-slate-600 cursor-pointer hover:text-blue-600 flex items-center gap-1`}>
                    <span>View metadata</span>
                    <svg className="w-4 h-4 transition-transform group-open/details:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <pre className={`${typography.caption.small} text-slate-600 bg-slate-100 rounded-lg p-3 mt-2 overflow-x-auto`}>
                    {JSON.stringify(item.metadata, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

const GraphContextCard = React.memo<{ graphContext: NonNullable<ClaimAnalysis['graphContext']> }>(({ graphContext }) => (
  <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
    <CardHeader className="pb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <ExternalLink className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className={`${typography.heading.h3} text-slate-900 mb-1`}>
            Related Context
          </h3>
          <p className={`${typography.caption.large} text-slate-600`}>
            Discovered through Graph RAG relationship traversal
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h4 className={`${typography.heading.h6} text-slate-800 mb-4 flex items-center gap-2`}>
            <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-bold text-purple-700">{graphContext.nodes.length}</span>
            </div>
            Connected Nodes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {graphContext.nodes.slice(0, 6).map((node) => {
              const title = typeof node.properties.title === 'string' ? node.properties.title : null;
              const description = typeof node.properties.description === 'string' ? node.properties.description : null;
              return (
                <div
                  key={node.id}
                  className="bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs font-semibold text-purple-700 border-purple-300 bg-purple-50">
                      {node.labels.join(', ')}
                    </Badge>
                  </div>
                  {title && (
                    <div className={`${typography.body.small} font-semibold text-slate-800 mb-1`}>
                      {title}
                    </div>
                  )}
                  {description && (
                    <div className={`${typography.caption.medium} text-slate-600 line-clamp-2`}>
                      {description.substring(0, 100)}...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {graphContext.relationships.length > 0 && (
          <div>
            <h4 className={`${typography.heading.h6} text-slate-800 mb-4 flex items-center gap-2`}>
              <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center">
                <span className="text-xs font-bold text-pink-700">{graphContext.relationships.length}</span>
              </div>
              Relationships
            </h4>
            <div className="space-y-2">
              {graphContext.relationships.slice(0, 5).map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white border border-slate-200 rounded-lg p-3 hover:border-pink-300 hover:bg-pink-50/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-semibold text-pink-700 border-pink-300 bg-pink-50">
                      {rel.type}
                    </Badge>
                    {rel.properties && Object.keys(rel.properties).length > 0 && (
                      <span className={`${typography.caption.small} text-slate-500`}>
                        {Object.entries(rel.properties).slice(0, 2).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
));

EvidenceSourcesList.displayName = 'EvidenceSourcesList';
GraphContextCard.displayName = 'GraphContextCard';

AnalysisResults.displayName = 'AnalysisResults';
