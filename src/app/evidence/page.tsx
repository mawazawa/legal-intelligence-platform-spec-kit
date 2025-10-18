/**
 * Evidence Management Page
 * Main interface for viewing, organizing, and managing legal evidence
 */

'use client';

import { useEffect, useState } from 'react';
import { FileText, Image, Video, Mail, File, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logging/logger';
import {
  getEvidenceFiles,
  getEvidenceStats,
  getExhibitIndex,
} from '@/lib/services/evidenceService';
import type {
  EvidenceFile,
  EvidenceStats,
  FileType,
  ExhibitIndexEntry,
} from '@/lib/types/evidence';

export default function EvidencePage() {
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [stats, setStats] = useState<EvidenceStats | null>(null);
  const [exhibitIndex, setExhibitIndex] = useState<ExhibitIndexEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<FileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Load evidence files, statistics, and exhibit index in parallel
     * Displays error message if any data fails to load
     */
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

  const filteredFiles = evidenceFiles.filter(file => {
    const matchesSearch =
      !searchQuery ||
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.file_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || file.evidence_category === selectedCategory;
    const matchesType = !selectedType || file.file_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (fileType: FileType) => {
    switch (fileType) {
      case 'pdf':
      case 'document':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'email':
        return <Mail className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading evidence files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Evidence Management</h1>
        <p className="text-muted-foreground">
          Organize and manage legal evidence for case FDI-21-794666
        </p>
      </div>

      {loadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          <p className="font-semibold">Error loading evidence</p>
          <p className="text-xs mt-1">{loadError}</p>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_files}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(stats.total_size_bytes)} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Authenticated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.authenticated_count}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for court filing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">FL-320 Exhibits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.by_filing['fl-320'] || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Responsive declaration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Evidence Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(stats.by_type).map(([type, count]) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search evidence by title, description, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedType === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType(null)}
        >
          All Types
        </Button>
        <Button
          variant={selectedType === 'pdf' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('pdf')}
        >
          PDFs ({stats?.by_type.pdf || 0})
        </Button>
        <Button
          variant={selectedType === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('image')}
        >
          Images ({stats?.by_type.image || 0})
        </Button>
        <Button
          variant={selectedType === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('video')}
        >
          Videos ({stats?.by_type.video || 0})
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Evidence ({filteredFiles.length})</TabsTrigger>
          <TabsTrigger value="exhibits">Exhibit Index ({exhibitIndex.length})</TabsTrigger>
          <TabsTrigger value="by-paragraph">By FL-320 Paragraph</TabsTrigger>
        </TabsList>

        {/* All Evidence Tab */}
        <TabsContent value="all" className="space-y-4">
          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No evidence files found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="mt-1">{getFileIcon(file.file_type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{file.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {file.description}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {file.file_name}
                            </p>
                          </div>

                          {/* Exhibit Badge */}
                          {file.exhibit_letter && (
                            <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                              Exhibit {file.exhibit_letter}
                            </Badge>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary">{file.file_type.toUpperCase()}</Badge>
                          {file.evidence_category && (
                            <Badge variant="secondary">{file.evidence_category}</Badge>
                          )}
                          {file.filing_type && (
                            <Badge variant="secondary">{file.filing_type}</Badge>
                          )}
                          {file.declaration_paragraph && (
                            <Badge variant="secondary">¶ {file.declaration_paragraph}</Badge>
                          )}
                          {file.authenticated && (
                            <Badge variant="default" className="bg-green-600">
                              Authenticated
                            </Badge>
                          )}
                          <Badge variant="outline">{formatFileSize(file.file_size)}</Badge>
                          {file.date_created && (
                            <Badge variant="outline">
                              {new Date(file.date_created).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
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
        </TabsContent>

        {/* Exhibit Index Tab */}
        <TabsContent value="exhibits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FL-320 Exhibit Index</CardTitle>
              <CardDescription>
                Exhibits for Responsive Declaration to Request for Order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exhibitIndex.map((exhibit) => (
                  <div key={exhibit.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="font-bold text-lg min-w-[60px]">
                      Exhibit {exhibit.exhibit_letter}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{exhibit.description}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {exhibit.evidence_file_id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Paragraph Tab */}
        <TabsContent value="by-paragraph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence by FL-320 Paragraph</CardTitle>
              <CardDescription>
                Evidence organized by declaration paragraph number
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const byParagraph = evidenceFiles.reduce((acc, file) => {
                  if (file.declaration_paragraph) {
                    if (!acc[file.declaration_paragraph]) {
                      acc[file.declaration_paragraph] = [];
                    }
                    acc[file.declaration_paragraph].push(file);
                  }
                  return acc;
                }, {} as Record<number, EvidenceFile[]>);

                return (
                  <div className="space-y-6">
                    {Object.entries(byParagraph)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([paragraph, files]) => (
                        <div key={paragraph}>
                          <h3 className="font-semibold mb-2">Paragraph {paragraph}</h3>
                          <div className="space-y-2">
                            {files.map((file) => (
                              <div key={file.id} className="flex items-center gap-3 pl-4">
                                {getFileIcon(file.file_type)}
                                <span className="text-sm">{file.title}</span>
                                {file.exhibit_letter && (
                                  <Badge variant="outline" className="ml-auto">
                                    Exhibit {file.exhibit_letter}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
