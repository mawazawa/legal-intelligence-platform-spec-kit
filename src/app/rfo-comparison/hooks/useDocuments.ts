import { useState, useEffect } from 'react';
import { safeFetch } from '@/lib/api/fetch';
import { logger } from '@/lib/logging/logger';
import type { RFOContent } from '../types';

interface UseDocumentsResult {
  petitionerRFO: RFOContent | null;
  respondentFL320: RFOContent | null;
  ledger: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

export const useDocuments = (): UseDocumentsResult => {
  const [petitionerRFO, setPetitionerRFO] = useState<RFOContent | null>(null);
  const [respondentFL320, setRespondentFL320] = useState<RFOContent | null>(null);
  const [ledger, setLedger] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const [rfoResult, fl320Result, ledgerResult] = await Promise.all([
          safeFetch<{ text: string; meta: Record<string, unknown> }>(
            '/api/case-financials/source?file=petitioner_rfo',
            { timeout: 15000, retries: 2 }
          ),
          safeFetch<{ text: string; meta: Record<string, unknown> }>(
            '/api/case-financials/source?file=respondent_fl320',
            { timeout: 15000, retries: 2 }
          ),
          safeFetch<Record<string, unknown>>(
            '/api/case-financials/ledger',
            { timeout: 15000, retries: 2 }
          ),
        ]);

        if (rfoResult.data) {
          setPetitionerRFO({
            text: rfoResult.data.text,
            meta: rfoResult.data.meta,
            pages: (rfoResult.data.meta?.pages as number) || 101
          });
          logger.debug('Loaded petitioner RFO', { size: rfoResult.data.text.length });
        }

        if (fl320Result.data) {
          setRespondentFL320({
            text: fl320Result.data.text,
            meta: fl320Result.data.meta,
            pages: (fl320Result.data.meta?.pages as number) || 0
          });
          logger.debug('Loaded respondent FL-320', { size: fl320Result.data.text.length });
        }

        if (ledgerResult.data) {
          setLedger(ledgerResult.data);
          logger.debug('Loaded ledger', { entries: Object.keys(ledgerResult.data).length });
        }

        if (rfoResult.error && fl320Result.error) {
          setError('Failed to load comparison documents. Please refresh the page.');
        }
      } catch (err) {
        logger.error('Error loading comparison documents', err as Error);
        setError('Unexpected error loading documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return { petitionerRFO, respondentFL320, ledger, loading, error };
};
