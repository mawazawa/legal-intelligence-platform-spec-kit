import { useState } from 'react';
import { logger } from '@/lib/logging/logger';
import { CaseFile } from '../types';
import { DocumentMetadata, AutoTaggingResult } from '@/lib/services/autoTaggingService';
import { useAutoTagging as useAutoTaggingService } from '@/hooks/useAutoTagging';

export const useFileAutoTagging = (
  files: CaseFile[],
  onFileUpdate: (fileId: string, updates: Partial<CaseFile>) => void
) => {
  const [showAutoTaggingModal, setShowAutoTaggingModal] = useState(false);
  const [selectedFilesForTagging, setSelectedFilesForTagging] = useState<CaseFile[]>([]);
  const [taggingResults, setTaggingResults] = useState<AutoTaggingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { analyzeDocuments, isLoading, error } = useAutoTaggingService();

  const handleAutoTagging = async () => {
    setIsProcessing(true);
    try {
      const documentsToAnalyze: DocumentMetadata[] = selectedFilesForTagging.map(file => ({
        filename: file.name,
        originalName: file.originalName,
        content: file.content,
        fileType: file.name.split('.').pop() || 'unknown',
        size: parseFloat(file.size.replace(/[^\d.]/g, '')) * 1024 * 1024,
        createdAt: new Date(file.date),
        modifiedAt: new Date(file.date),
        caseNumber: file.metadata?.caseNumber,
        pageCount: file.metadata?.pages
      }));

      const results = await analyzeDocuments(documentsToAnalyze);
      setTaggingResults(results);
    } catch (err) {
      logger.error('Auto-tagging failed', err as Error, { fileCount: selectedFilesForTagging.length });
    } finally {
      setIsProcessing(false);
    }
  };

  const applyAutoTaggingResults = () => {
    taggingResults.forEach((result, index) => {
      const file = selectedFilesForTagging[index];
      if (file) {
        onFileUpdate(file.id, {
          tags: result.tags,
          category: result.category,
          relevance: result.relevance,
          name: result.suggestedName,
          autoTaggingResult: result,
          needsReview: result.confidence < 0.8
        });
      }
    });
    setShowAutoTaggingModal(false);
    setSelectedFilesForTagging([]);
    setTaggingResults([]);
  };

  const openAutoTaggingModal = () => {
    setSelectedFilesForTagging(files.filter(f => !f.autoTaggingResult));
    setShowAutoTaggingModal(true);
  };

  return {
    showAutoTaggingModal,
    setShowAutoTaggingModal,
    selectedFilesForTagging,
    taggingResults,
    isProcessing,
    isLoading,
    error,
    handleAutoTagging,
    applyAutoTaggingResults,
    openAutoTaggingModal
  };
};
