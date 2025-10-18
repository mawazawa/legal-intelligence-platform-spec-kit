'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { logger } from '@/lib/logging/logger';
import { useAutoTagging } from '@/hooks/useAutoTagging';
import { DocumentMetadata, AutoTaggingResult } from '@/lib/services/autoTaggingService';
import { 
  Search, 
  FileText, 
  Folder, 
  Tag, 
  Filter,
  ChevronRight,
  ChevronDown,
  Eye,
  Download,
  ExternalLink,
  Calculator,
  Scale,
  DollarSign,
  Calendar,
  User,
  Bot,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wand2,
  Settings
} from 'lucide-react';

interface CaseFile {
  id: string;
  name: string;
  originalName: string;
  type: 'judgment' | 'rfo' | 'fl320' | 'exhibit' | 'evidence' | 'financial' | 'email' | 'other';
  category: 'core' | 'supporting' | 'reference' | 'exhibit';
  tags: string[];
  date: string;
  size: string;
  description: string;
  relevance: 'critical' | 'important' | 'supporting' | 'reference';
  linkedTo?: string[];
  content?: string;
  metadata?: Record<string, any>;
  autoTaggingResult?: AutoTaggingResult;
  needsReview?: boolean;
}

interface EnhancedCaseFileExplorerProps {
  files: CaseFile[];
  onFileSelect: (file: CaseFile) => void;
  onFileOpen: (file: CaseFile) => void;
  onFileUpdate: (fileId: string, updates: Partial<CaseFile>) => void;
  selectedFileId?: string;
}

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
  const [showAutoTaggingModal, setShowAutoTaggingModal] = useState(false);
  const [selectedFilesForTagging, setSelectedFilesForTagging] = useState<CaseFile[]>([]);
  const [taggingResults, setTaggingResults] = useState<AutoTaggingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { analyzeDocuments, getAvailableTags, isLoading, error } = useAutoTagging();

  /**
   * Handle auto-tagging of selected files
   */
  const handleAutoTagging = async () => {
    setIsProcessing(true);
    const fileCount = selectedFilesForTagging.length;

    try {
      logger.debug('Starting auto-tagging', { fileCount });

      const documentsToAnalyze: DocumentMetadata[] = selectedFilesForTagging.map(file => ({
        filename: file.name,
        originalName: file.originalName,
        content: file.content,
        fileType: file.name.split('.').pop() || 'unknown',
        size: parseFloat(file.size.replace(/[^\d.]/g, '')) * 1024 * 1024, // Convert MB to bytes
        createdAt: new Date(file.date),
        modifiedAt: new Date(file.date),
        caseNumber: file.metadata?.caseNumber,
        pageCount: file.metadata?.pages
      }));

      const results = await analyzeDocuments(documentsToAnalyze);
      setTaggingResults(results);
      logger.info('Auto-tagging completed successfully', {
        filesProcessed: fileCount,
        resultsCount: results.length
      });
    } catch (err) {
      logger.error('Auto-tagging failed', err as Error, {
        filesCount: fileCount
      });
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

  // Enhanced file processing with auto-tagging results
  const processedFiles = useMemo(() => {
    return files.map(file => {
      // If file has auto-tagging results, use them
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

  // Filter files based on search and filters
  const filteredFiles = useMemo(() => {
    return processedFiles.filter(file => {
      const matchesSearch = !searchQuery || 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
      const matchesType = selectedType === 'all' || file.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [processedFiles, searchQuery, selectedCategory, selectedType]);

  // Group files by category
  const groupedFiles = useMemo(() => {
    const groups: Record<string, CaseFile[]> = {};
    filteredFiles.forEach(file => {
      if (!groups[file.category]) {
        groups[file.category] = [];
      }
      groups[file.category].push(file);
    });
    return groups;
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

  const getFileIcon = (type: CaseFile['type']) => {
    switch (type) {
      case 'judgment': return <Scale className="h-4 w-4 text-purple-600" />;
      case 'rfo': return <FileText className="h-4 w-4 text-red-600" />;
      case 'fl320': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'exhibit': return <ExternalLink className="h-4 w-4 text-green-600" />;
      case 'financial': return <DollarSign className="h-4 w-4 text-yellow-600" />;
      case 'email': return <User className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRelevanceColor = (relevance: CaseFile['relevance']) => {
    switch (relevance) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'important': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'supporting': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categoryLabels = {
    core: 'Core Documents',
    supporting: 'Supporting Evidence',
    exhibit: 'Exhibits',
    reference: 'Reference Materials'
  };

  const filesNeedingReview = files.filter(f => f.needsReview).length;
  const filesWithAutoTagging = files.filter(f => f.autoTaggingResult).length;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-lg">Case File Explorer</h2>
          </div>
          <div className="flex items-center gap-2">
            {filesNeedingReview > 0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                {filesNeedingReview} need review
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={openAutoTaggingModal}
              className="text-xs"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Auto-Tag
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files, tags, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-2 py-1 border rounded"
          >
            <option value="all">All Categories</option>
            <option value="core">Core</option>
            <option value="supporting">Supporting</option>
            <option value="exhibit">Exhibits</option>
            <option value="reference">Reference</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-2 py-1 border rounded"
          >
            <option value="all">All Types</option>
            <option value="judgment">Judgment</option>
            <option value="rfo">RFO</option>
            <option value="fl320">FL-320</option>
            <option value="exhibit">Exhibit</option>
            <option value="financial">Financial</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Auto-tagging status */}
        {filesWithAutoTagging > 0 && (
          <div className="text-xs text-gray-600 mb-2">
            <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
            {filesWithAutoTagging} files auto-tagged
          </div>
        )}
      </div>

      {/* File List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
            <div key={category}>
              <button
                onClick={() => toggleFolder(category)}
                className="flex items-center gap-2 w-full text-left font-medium text-sm text-gray-700 hover:text-gray-900 mb-2"
              >
                {expandedFolders.has(category) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <Folder className="h-4 w-4" />
                {categoryLabels[category as keyof typeof categoryLabels]}
                <Badge variant="outline" className="ml-auto text-xs">
                  {categoryFiles.length}
                </Badge>
              </button>

              {expandedFolders.has(category) && (
                <div className="space-y-2 ml-6">
                  {categoryFiles.map(file => (
                    <Card
                      key={file.id}
                      className={`cursor-pointer transition-all hover:shadow-sm ${
                        selectedFileId === file.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      } ${file.needsReview ? 'border-orange-200 bg-orange-50' : ''}`}
                      onClick={() => onFileSelect(file)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {file.name}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getRelevanceColor(file.relevance)}`}
                              >
                                {file.relevance}
                              </Badge>
                              {file.needsReview && (
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                  <AlertCircle className="h-2 w-2 mr-1" />
                                  Review
                                </Badge>
                              )}
                              {file.autoTaggingResult && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                  <Bot className="h-2 w-2 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {file.description}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{file.date}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{file.size}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {file.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{file.tags.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onFileOpen(file);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle download
                                }}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Auto-Tagging Modal */}
      <Dialog open={showAutoTaggingModal} onOpenChange={setShowAutoTaggingModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              Auto-Tagging Analysis
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Analyzing {selectedFilesForTagging.length} files for automatic tagging and renaming...
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing files...</span>
              </div>
            )}

            {taggingResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Analysis Results:</h4>
                {taggingResults.map((result, index) => {
                  const file = selectedFilesForTagging[index];
                  return (
                    <div key={file.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{file.name}</span>
                        <Badge variant="outline" className={`text-xs ${
                          result.confidence > 0.8 ? 'text-green-600 border-green-200' : 'text-orange-600 border-orange-200'
                        }`}>
                          {Math.round(result.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Suggested name: <span className="font-mono">{result.suggestedName}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {result.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoTaggingModal(false)}>
              Cancel
            </Button>
            {taggingResults.length === 0 && (
              <Button onClick={handleAutoTagging} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Analyze Files
                  </>
                )}
              </Button>
            )}
            {taggingResults.length > 0 && (
              <Button onClick={applyAutoTaggingResults}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Results
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedCaseFileExplorer;
