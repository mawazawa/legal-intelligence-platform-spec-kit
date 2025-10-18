'use client';

import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { logger } from '@/lib/logging/logger';
import { ExplorerHeader } from './case-file-explorer/components/ExplorerHeader';
import { SearchAndFilters } from './case-file-explorer/components/SearchAndFilters';
import { CategoryFolder } from './case-file-explorer/components/CategoryFolder';
import { AutoTaggingModal } from './case-file-explorer/components/AutoTaggingModal';
import { useFileAutoTagging } from './case-file-explorer/hooks/useAutoTagging';
import { EnhancedCaseFileExplorerProps, CaseFile } from './case-file-explorer/types';
import { filterFiles, groupFilesByCategory } from './case-file-explorer/utils/fileUtils';
import { CATEGORY_LABELS } from './case-file-explorer/constants';

const EnhancedCaseFileExplorer: React.FC<EnhancedCaseFileExplorerProps> = ({
  files,
  onFileSelect,
  onFileOpen,
  onFileUpdate,
  selectedFileId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['core', 'supporting']));

  const {
    showAutoTaggingModal,
    setShowAutoTaggingModal,
    selectedFilesForTagging,
    taggingResults,
    isProcessing,
    error,
    handleAutoTagging: performAutoTagging,
    applyAutoTaggingResults,
    openAutoTaggingModal
  } = useFileAutoTagging(files, onFileUpdate);

  const handleAutoTagging = async () => {
    const fileCount = selectedFilesForTagging.length;
    logger.debug('Starting auto-tagging', { fileCount });

    try {
      await performAutoTagging();
      logger.info('Auto-tagging completed successfully', { filesProcessed: fileCount });
    } catch (err) {
      logger.error('Auto-tagging failed', err as Error, { filesCount: fileCount });
    }
  };

  const processedFiles = useMemo(() => {
    return files.map(file => {
      if (file.autoTaggingResult) {
        return {
          ...file,
          tags: file.autoTaggingResult.tags,
          category: file.autoTaggingResult.category,
          relevance: file.autoTaggingResult.relevance
        };
      }
      return file;
    });
  }, [files]);

  const filteredFiles = useMemo(() => {
    return filterFiles(processedFiles, searchQuery, selectedCategory, selectedType);
  }, [processedFiles, searchQuery, selectedCategory, selectedType]);

  const groupedFiles = useMemo(() => {
    return groupFilesByCategory(filteredFiles);
  }, [filteredFiles]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const filesNeedingReview = files.filter(f => f.needsReview).length;
  const filesWithAutoTagging = files.filter(f => f.autoTaggingResult).length;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <ExplorerHeader
        filesNeedingReview={filesNeedingReview}
        onAutoTag={openAutoTaggingModal}
      />

      <div className="px-4">
        <SearchAndFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          filesWithAutoTagging={filesWithAutoTagging}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
            <CategoryFolder
              key={category}
              category={category}
              label={CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              files={categoryFiles}
              isExpanded={expandedFolders.has(category)}
              selectedFileId={selectedFileId}
              onToggle={() => toggleFolder(category)}
              onFileSelect={onFileSelect}
              onFileOpen={onFileOpen}
            />
          ))}
        </div>
      </ScrollArea>

      <AutoTaggingModal
        isOpen={showAutoTaggingModal}
        selectedFiles={selectedFilesForTagging}
        taggingResults={taggingResults}
        isProcessing={isProcessing}
        error={error}
        onClose={() => setShowAutoTaggingModal(false)}
        onAnalyze={handleAutoTagging}
        onApply={applyAutoTaggingResults}
      />
    </div>
  );
};

export default EnhancedCaseFileExplorer;
