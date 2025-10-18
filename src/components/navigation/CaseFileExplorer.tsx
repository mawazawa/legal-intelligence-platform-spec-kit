'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  User
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
  linkedTo?: string[]; // IDs of related documents
  content?: string;
  metadata?: Record<string, any>;
}

interface CaseFileExplorerProps {
  files: CaseFile[];
  onFileSelect: (file: CaseFile) => void;
  onFileOpen: (file: CaseFile) => void;
  selectedFileId?: string;
}

const CaseFileExplorer: React.FC<CaseFileExplorerProps> = ({
  files,
  onFileSelect,
  onFileOpen,
  selectedFileId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['core', 'supporting']));

  // Auto-tagging and categorization logic
  const processedFiles = useMemo(() => {
    return files.map(file => {
      const tags: string[] = [];
      let category: CaseFile['category'] = 'reference';
      let relevance: CaseFile['relevance'] = 'reference';

      // Auto-tagging based on filename and content
      const name = file.name.toLowerCase();
      
      if (name.includes('judgment') || name.includes('statement of decision')) {
        tags.push('judgment', 'core-document');
        category = 'core';
        relevance = 'critical';
      } else if (name.includes('rfo') || name.includes('request for order')) {
        tags.push('rfo', 'petitioner-filing');
        category = 'core';
        relevance = 'critical';
      } else if (name.includes('fl320') || name.includes('responsive declaration')) {
        tags.push('fl320', 'respondent-filing');
        category = 'core';
        relevance = 'critical';
      } else if (name.includes('exhibit')) {
        tags.push('exhibit', 'evidence');
        category = 'exhibit';
        relevance = 'important';
      } else if (name.includes('closing') || name.includes('financial')) {
        tags.push('financial', 'closing-statement');
        category = 'supporting';
        relevance = 'important';
      } else if (name.includes('email') || name.includes('correspondence')) {
        tags.push('email', 'communication');
        category = 'supporting';
        relevance = 'supporting';
      }

      // Additional content-based tagging
      if (file.content) {
        const content = file.content.toLowerCase();
        if (content.includes('mortgage') || content.includes('arrears')) {
          tags.push('mortgage-arrears');
        }
        if (content.includes('tax') || content.includes('withholding')) {
          tags.push('tax-withholding');
        }
        if (content.includes('watts') || content.includes('charges')) {
          tags.push('watts-charges');
        }
        if (content.includes('distribution') || content.includes('split')) {
          tags.push('distribution-calculation');
        }
      }

      return {
        ...file,
        tags: [...new Set([...file.tags, ...tags])],
        category,
        relevance
      };
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

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-lg">Case File Explorer</h2>
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
                      }`}
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
    </div>
  );
};

export default CaseFileExplorer;
