'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';
import {
  Search,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ClaimAnalysis {
  claim: string;
  evidence: Array<{
    id: string;
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, unknown>;
  }>;
  graphContext?: {
    nodes: Array<{
      id: string;
      labels: string[];
      properties: Record<string, unknown>;
    }>;
    relationships: Array<{
      id: string;
      type: string;
      startNodeId: string;
      endNodeId: string;
      properties: Record<string, unknown>;
    }>;
  };
  answer: string;
  metadata: {
    query: string;
    totalResults: number;
    processingTime: number;
    sources: string[];
  };
}

const ClaimsAnalysis: React.FC = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Predefined claim templates
  const claimTemplates = [
    "Respondent prolonged the legal proceedings through multiple continuances",
    "Petitioner was cooperative throughout the divorce process",
    "Respondent failed to provide timely discovery responses",
    "Petitioner's attorney fees were reasonable and necessary",
    "Respondent interfered with property sale negotiations",
    "Petitioner's financial disclosures were complete and accurate"
  ];

  const analyzeClaim = async (claimQuery: string) => {
    if (!claimQuery.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: claimQuery,
          maxResults: 10,
          threshold: 0.7,
          includeGraph: true,
          graphHops: 2
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    setQuery(template);
    analyzeClaim(template);
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const exportData = {
      claim: analysis.claim || query,
      analysis: analysis.answer,
      evidence: analysis.evidence,
      sources: analysis.metadata.sources,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim-analysis-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <Badge variant="outline" className="text-xs font-semibold text-indigo-700 border-indigo-300 bg-indigo-50">
                AI-Powered Analysis
              </Badge>
            </div>
          </div>
          <h1 className={`${typography.heading.h1} text-slate-900 mb-3`}>
            Claims Analysis
          </h1>
          <p className={`${typography.body.large} text-slate-600 max-w-3xl`}>
            Analyze opposing party claims with evidence-based refutations powered by Graph RAG
          </p>
        </div>

        {/* Query Input */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60 mb-8 transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className={`${typography.heading.h4} text-slate-900 flex items-center gap-2`}>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              Analyze Claim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <label htmlFor="claim-input" className={`${typography.label.medium} text-slate-700 mb-3 block`}>
                  Enter the claim to analyze
                </label>
                <div className="relative">
                  <textarea
                    id="claim-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter a claim from the opposing party to analyze with AI-powered evidence search..."
                    className={`${typography.body.medium} w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 resize-none placeholder:text-slate-400`}
                    rows={4}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                    {query.length} characters
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => analyzeClaim(query)}
                  disabled={loading || !query.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Analyze Claim
                    </>
                  )}
                </Button>

                {analysis && (
                  <Button
                    onClick={exportAnalysis}
                    variant="outline"
                    className="border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Analysis
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claim Templates */}
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
              {claimTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateClick(template)}
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

        {/* Error Display */}
        {error && (
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
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Analysis Summary */}
            <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-2xl border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
                <div className="bg-white rounded-t-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`${typography.heading.h3} text-slate-900 mb-1`}>
                          Analysis Complete
                        </CardTitle>
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
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`${typography.heading.h3} text-slate-900 mb-1`}>
                      Supporting Evidence
                    </CardTitle>
                    <p className={`${typography.caption.large} text-slate-600`}>
                      {analysis.evidence.length} relevant sources found
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.evidence.map((item, index) => (
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

            {/* Graph Context */}
            {analysis.graphContext && analysis.graphContext.nodes.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`${typography.heading.h3} text-slate-900 mb-1`}>
                        Related Context
                      </CardTitle>
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
                          <span className="text-xs font-bold text-purple-700">{analysis.graphContext.nodes.length}</span>
                        </div>
                        Connected Nodes
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {analysis.graphContext.nodes.slice(0, 6).map((node) => {
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

                    {analysis.graphContext.relationships.length > 0 && (
                      <div>
                        <h4 className={`${typography.heading.h6} text-slate-800 mb-4 flex items-center gap-2`}>
                          <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-pink-700">{analysis.graphContext.relationships.length}</span>
                          </div>
                          Relationships
                        </h4>
                        <div className="space-y-2">
                          {analysis.graphContext.relationships.slice(0, 5).map((rel) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsAnalysis;
