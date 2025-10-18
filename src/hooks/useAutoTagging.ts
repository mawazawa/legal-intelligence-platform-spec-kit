import { useState, useCallback } from 'react';
import { DocumentMetadata, AutoTaggingResult } from '@/lib/services/autoTaggingService';

interface UseAutoTaggingReturn {
  analyzeDocument: (metadata: DocumentMetadata) => Promise<AutoTaggingResult>;
  analyzeDocuments: (documents: DocumentMetadata[]) => Promise<AutoTaggingResult[]>;
  getAvailableTags: () => Promise<string[]>;
  isLoading: boolean;
  error: string | null;
}

export const useAutoTagging = (): UseAutoTaggingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDocument = useCallback(async (metadata: DocumentMetadata): Promise<AutoTaggingResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auto-tagging/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents: [metadata] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      return data.results[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeDocuments = useCallback(async (documents: DocumentMetadata[]): Promise<AutoTaggingResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auto-tagging/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      return data.results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAvailableTags = useCallback(async (): Promise<string[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auto-tagging/analyze');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to retrieve tags');
      }

      return data.availableTags;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyzeDocument,
    analyzeDocuments,
    getAvailableTags,
    isLoading,
    error,
  };
};
