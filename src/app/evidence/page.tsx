/**
 * Evidence Management Page
 * Main interface for viewing, organizing, and managing legal evidence
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FileType, EvidenceFile } from '@/lib/types/evidence';
import { useEvidence } from './hooks/useEvidence';
import { StatsCards } from './components/StatsCards';
import { SearchAndFilters } from './components/SearchAndFilters';
import { EvidenceCard } from './components/EvidenceCard';
import { getFileIcon } from './utils';
import { Badge } from '@/components/ui/badge';

export default function EvidencePage() {
  const { evidenceFiles, stats, exhibitIndex, loading, loadError } = useEvidence();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<FileType | null>(null);

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

      {stats && <StatsCards stats={stats} />}

      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        stats={stats}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Evidence ({filteredFiles.length})</TabsTrigger>
          <TabsTrigger value="exhibits">Exhibit Index ({exhibitIndex.length})</TabsTrigger>
          <TabsTrigger value="by-paragraph">By FL-320 Paragraph</TabsTrigger>
        </TabsList>

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
                <EvidenceCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exhibits" className="space-y-4">
          <Card>
            <CardContent className="p-6">
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

        <TabsContent value="by-paragraph" className="space-y-4">
          <Card>
            <CardContent className="p-6">
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
