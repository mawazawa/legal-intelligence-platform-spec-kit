import { useState } from 'react';
import { ClaimAnalysis } from '../types';
import { DEFAULT_QUERY_PARAMS } from '../constants';

export const useClaimAnalysis = () => {
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          ...DEFAULT_QUERY_PARAMS
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

  return {
    analysis,
    loading,
    error,
    analyzeClaim
  };
};
