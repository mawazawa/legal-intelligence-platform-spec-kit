import { useState, useEffect } from 'react';
import { safeFetch } from '@/lib/api/fetch';
import { logger } from '@/lib/logging/logger';

export const useDocumentLoader = () => {
  const [petitionerRFO, setPetitionerRFO] = useState<string>('');
  const [petitionerDecl, setPetitionerDecl] = useState<string>('');
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setDocumentsLoading(true);
      setDocumentsError(null);

      try {
        // Fetch petitioner RFO
        const rfoResult = await safeFetch<{ text: string }>(
          '/api/case-financials/source?file=petitioner_rfo',
          { timeout: 10000, retries: 2 }
        );

        if (rfoResult.error) {
          logger.warn('Failed to load petitioner RFO', {
            error: rfoResult.error.message,
            status: rfoResult.status,
          });
          setPetitionerRFO('');
        } else if (rfoResult.data) {
          setPetitionerRFO(rfoResult.data.text || '');
          logger.debug('Loaded petitioner RFO', { size: rfoResult.data.text.length });
        }

        // Fetch petitioner declaration
        const declResult = await safeFetch<{ text: string }>(
          '/api/case-financials/source?file=petitioner_declaration',
          { timeout: 10000, retries: 2 }
        );

        if (declResult.error) {
          logger.warn('Failed to load petitioner declaration', {
            error: declResult.error.message,
            status: declResult.status,
          });
          setPetitionerDecl('');
        } else if (declResult.data) {
          setPetitionerDecl(declResult.data.text || '');
          logger.debug('Loaded petitioner declaration', { size: declResult.data.text.length });
        }

        // Check if both failed
        if (rfoResult.error && declResult.error) {
          setDocumentsError('Failed to load documents. Please refresh the page.');
        }
      } catch (err) {
        logger.error('Error loading petitioner documents', err as Error);
        setDocumentsError('Unexpected error loading documents');
      } finally {
        setDocumentsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return {
    petitionerRFO,
    petitionerDecl,
    documentsLoading,
    documentsError
  };
};
