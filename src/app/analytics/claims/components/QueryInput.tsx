'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typography } from '@/styles/typography';
import { Search, Clock, Sparkles, Download } from 'lucide-react';
import { ClaimAnalysis } from '../types';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  analysis: ClaimAnalysis | null;
  onExport: () => void;
}

export const QueryInput = React.memo<QueryInputProps>(({
  query,
  setQuery,
  onAnalyze,
  loading,
  analysis,
  onExport
}) => {
  return (
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
              onClick={onAnalyze}
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
                onClick={onExport}
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
  );
});

QueryInput.displayName = 'QueryInput';
