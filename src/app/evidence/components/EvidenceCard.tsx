"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { EvidenceFile } from '@/lib/types/evidence';
import { getFileIcon, formatFileSize } from '../utils';

interface EvidenceCardProps {
  file: EvidenceFile;
}

export const EvidenceCard = React.memo<EvidenceCardProps>(({ file }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">{getFileIcon(file.file_type)}</div>

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

              {file.exhibit_letter && (
                <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                  Exhibit {file.exhibit_letter}
                </Badge>
              )}
            </div>

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
  );
});

EvidenceCard.displayName = 'EvidenceCard';
