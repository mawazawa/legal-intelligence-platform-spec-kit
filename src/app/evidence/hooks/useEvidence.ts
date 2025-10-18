import { useEffect, useState } from 'react';
import { logger } from '@/lib/logging/logger';
import {
  getEvidenceFiles,
  getEvidenceStats,
  getExhibitIndex,
} from '@/lib/services/evidenceService';
import type {
  EvidenceFile,
  EvidenceStats,
  ExhibitIndexEntry,
} from '@/lib/types/evidence';

interface UseEvidenceResult {
  evidenceFiles: EvidenceFile[];
  stats: EvidenceStats | null;
  exhibitIndex: ExhibitIndexEntry[];
  loading: boolean;
  loadError: string | null;
}

export const useEvidence = (): UseEvidenceResult => {
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [stats, setStats] = useState<EvidenceStats | null>(null);
  const [exhibitIndex, setExhibitIndex] = useState<ExhibitIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvidence() {
      setLoading(true);
      setLoadError(null);

      try {
        logger.debug('Loading evidence data');
        const [files, statsData, fl320Index] = await Promise.all([
          getEvidenceFiles(),
          getEvidenceStats(),
          getExhibitIndex('fl-320'),
        ]);

        setEvidenceFiles(files);
        setStats(statsData);
        setExhibitIndex(fl320Index);

        logger.info('Evidence data loaded successfully', {
          fileCount: files.length,
          exhibitCount: fl320Index.length
        });
      } catch (error) {
        logger.error('Error loading evidence', error as Error);
        setLoadError('Failed to load evidence. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, []);

  return { evidenceFiles, stats, exhibitIndex, loading, loadError };
};
