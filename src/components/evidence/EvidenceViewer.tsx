/**
 * Evidence Viewer Component
 * Displays PDF, image, and video evidence files
 */

'use client';

import { useState } from 'react';
import { X, Download, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EvidenceFile } from '@/lib/types/evidence';

interface EvidenceViewerProps {
  evidence: EvidenceFile;
  onClose?: () => void;
  showMetadata?: boolean;
}

export function EvidenceViewer({ evidence, onClose, showMetadata = true }: EvidenceViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const renderContent = () => {
    const baseUrl = '/evidence-files/'; // This would be your actual file storage URL

    switch (evidence.file_type) {
      case 'pdf':
        return (
          <div className="w-full h-full bg-gray-100 rounded">
            <iframe
              src={`${baseUrl}${evidence.file_path}`}
              className="w-full h-full rounded"
              title={evidence.title}
              style={{ minHeight: '600px' }}
            />
          </div>
        );

      case 'image':
        return (
          <div className="flex items-center justify-center bg-gray-100 rounded p-4">
            <img
              src={`${baseUrl}${evidence.file_path}`}
              alt={evidence.title}
              className="max-w-full h-auto rounded shadow-lg"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="w-full bg-black rounded">
            <video
              controls
              className="w-full h-auto rounded"
              style={{ maxHeight: '600px' }}
            >
              <source src={`${baseUrl}${evidence.file_path}`} type={evidence.mime_type} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
            <p className="text-muted-foreground">
              Preview not available for this file type
            </p>
          </div>
        );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{evidence.title}</CardTitle>
                {evidence.description && (
                  <p className="text-sm text-muted-foreground">{evidence.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  {evidence.exhibit_letter && (
                    <Badge variant="outline" className="font-bold">
                      Exhibit {evidence.exhibit_letter}
                    </Badge>
                  )}
                  <Badge variant="secondary">{evidence.file_type.toUpperCase()}</Badge>
                  <Badge variant="outline">{formatFileSize(evidence.file_size)}</Badge>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                {evidence.file_type === 'image' && (
                  <>
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                {onClose && (
                  <Button variant="outline" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Viewer */}
              <div className="lg:col-span-3">{renderContent()}</div>

              {/* Metadata Sidebar */}
              {showMetadata && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">File Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Filename:</span>
                        <p className="font-mono text-xs break-all">{evidence.file_name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p>{evidence.mime_type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <p>{formatFileSize(evidence.file_size)}</p>
                      </div>
                    </div>
                  </div>

                  {evidence.date_created && (
                    <div>
                      <h3 className="font-semibold mb-2">Date Information</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <p>{new Date(evidence.date_created).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Case Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Case Number:</span>
                        <p className="font-mono">{evidence.case_number}</p>
                      </div>
                      {evidence.filing_type && (
                        <div>
                          <span className="text-muted-foreground">Filing:</span>
                          <p className="uppercase">{evidence.filing_type}</p>
                        </div>
                      )}
                      {evidence.declaration_paragraph && (
                        <div>
                          <span className="text-muted-foreground">Paragraph:</span>
                          <p>¶ {evidence.declaration_paragraph}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {evidence.evidence_category && (
                    <div>
                      <h3 className="font-semibold mb-2">Categorization</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p className="capitalize">{evidence.evidence_category}</p>
                        </div>
                        {evidence.claim_key && (
                          <div>
                            <span className="text-muted-foreground">Claim:</span>
                            <p className="capitalize">{evidence.claim_key.replace(/_/g, ' ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {evidence.authenticated && (
                    <div>
                      <h3 className="font-semibold mb-2">Authentication</h3>
                      <div className="space-y-2 text-sm">
                        <Badge variant="default" className="bg-green-600">
                          Authenticated
                        </Badge>
                        {evidence.authentication_method && (
                          <p className="text-muted-foreground text-xs capitalize">
                            {evidence.authentication_method.replace(/_/g, ' ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {evidence.evidence_tags && evidence.evidence_tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {evidence.evidence_tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
