'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  ExternalLink
} from 'lucide-react';

interface ClaimAnalysis {
  claim: string;
  evidence: Array<{
    id: string;
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, any>;
  }>;
  graphContext?: {
    nodes: Array<{
      id: string;
      labels: string[];
      properties: Record<string, any>;
    }>;
    relationships: Array<{
      id: string;
      type: string;
      startNodeId: string;
      endNodeId: string;
      properties: Record<string, any>;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Claims Analysis</h1>
          <p className="text-slate-600">Analyze opposing party claims with evidence-based refutations</p>
        </div>

        {/* Query Input */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Analyze Claim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="claim-input" className="block text-sm font-medium text-slate-700 mb-2">
                  Enter the claim to analyze:
                </label>
                <textarea
                  id="claim-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a claim from the opposing party to analyze..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => analyzeClaim(query)}
                  disabled={loading || !query.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Claim
                    </>
                  )}
                </Button>
                
                {analysis && (
                  <Button
                    onClick={exportAnalysis}
                    variant="outline"
                    className="border-slate-300"
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
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Common Claims to Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {claimTemplates.map((template, index) => (
                <Button
                  key={index}
                  onClick={() => handleTemplateClick(template)}
                  variant="outline"
                  className="text-left h-auto p-3 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="text-sm text-slate-700">{template}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border-red-200 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Analysis Error</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Analysis Summary */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Claim:</h4>
                    <p className="text-slate-700 italic">"{analysis.claim || query}"</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Evidence-Based Response:</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <p className="text-slate-700 whitespace-pre-wrap">{analysis.answer}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analysis.metadata.totalResults}</div>
                      <div className="text-sm text-slate-600">Evidence Sources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analysis.metadata.sources.length}</div>
                      <div className="text-sm text-slate-600">Document Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analysis.metadata.processingTime}ms</div>
                      <div className="text-sm text-slate-600">Processing Time</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Sources */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Supporting Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.evidence.map((item, index) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              item.similarity > 0.8 ? 'border-green-300 text-green-700' :
                              item.similarity > 0.6 ? 'border-yellow-300 text-yellow-700' :
                              'border-red-300 text-red-700'
                            }`}
                          >
                            {Math.round(item.similarity * 100)}% match
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.source}
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3">
                        <p className="text-sm text-slate-700 italic">
                          "{item.content}"
                        </p>
                      </div>
                      
                      {item.metadata && Object.keys(item.metadata).length > 0 && (
                        <div className="text-xs text-slate-500">
                          <strong>Metadata:</strong> {JSON.stringify(item.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Graph Context */}
            {analysis.graphContext && analysis.graphContext.nodes.length > 0 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Related Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">Related Nodes:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.graphContext.nodes.slice(0, 6).map((node, index) => (
                          <div key={node.id} className="bg-slate-50 border border-slate-200 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {node.labels.join(', ')}
                              </Badge>
                            </div>
                            {node.properties.title && (
                              <div className="text-sm font-medium text-slate-800">
                                {node.properties.title}
                              </div>
                            )}
                            {node.properties.description && (
                              <div className="text-xs text-slate-600 mt-1">
                                {node.properties.description.substring(0, 100)}...
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {analysis.graphContext.relationships.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2">Relationships:</h4>
                        <div className="space-y-2">
                          {analysis.graphContext.relationships.slice(0, 5).map((rel, index) => (
                            <div key={rel.id} className="text-sm text-slate-600">
                              <Badge variant="outline" className="text-xs mr-2">
                                {rel.type}
                              </Badge>
                              {rel.properties && Object.keys(rel.properties).length > 0 && (
                                <span className="text-xs text-slate-500">
                                  {JSON.stringify(rel.properties)}
                                </span>
                              )}
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
