import { ClaimAnalysis } from '../types';

export const exportAnalysis = (analysis: ClaimAnalysis, query: string) => {
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
