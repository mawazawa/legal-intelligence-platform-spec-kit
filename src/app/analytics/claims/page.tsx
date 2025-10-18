'use client';

import React, { useState } from 'react';
import { PageHeader } from './components/PageHeader';
import { QueryInput } from './components/QueryInput';
import { ClaimTemplates } from './components/ClaimTemplates';
import { ErrorDisplay } from './components/ErrorDisplay';
import { AnalysisResults } from './components/AnalysisResults';
import { useClaimAnalysis } from './hooks/useClaimAnalysis';
import { exportAnalysis } from './utils/exportUtils';
import { CLAIM_TEMPLATES } from './constants';

const ClaimsAnalysis: React.FC = () => {
  const [query, setQuery] = useState('');
  const { analysis, loading, error, analyzeClaim } = useClaimAnalysis();

  const handleTemplateClick = (template: string) => {
    setQuery(template);
    analyzeClaim(template);
  };

  const handleAnalyze = () => {
    analyzeClaim(query);
  };

  const handleExport = () => {
    if (analysis) {
      exportAnalysis(analysis, query);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        <QueryInput
          query={query}
          setQuery={setQuery}
          onAnalyze={handleAnalyze}
          loading={loading}
          analysis={analysis}
          onExport={handleExport}
        />

        <ClaimTemplates
          templates={CLAIM_TEMPLATES}
          onTemplateClick={handleTemplateClick}
          loading={loading}
        />

        {error && <ErrorDisplay error={error} />}

        {analysis && <AnalysisResults analysis={analysis} query={query} />}
      </div>
    </div>
  );
};

export default ClaimsAnalysis;
