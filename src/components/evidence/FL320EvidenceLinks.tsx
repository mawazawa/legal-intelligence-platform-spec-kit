/**
 * FL-320 Evidence Links Component
 * Shows evidence linked to FL-320 declaration paragraphs
 * Displays inline with the declaration for easy reference
 */

'use client';

import { useEffect, useState } from 'react';
import { FileText, Image, Video, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getEvidenceForParagraph } from '@/lib/services/evidenceService';
import type { EvidenceFile, FileType } from '@/lib/types/evidence';

interface FL320EvidenceLinksProps {
  paragraphNumber: number;
  paragraphTitle?: string;
  onViewEvidence?: (evidence: EvidenceFile) => void;
}

export function FL320EvidenceLinks({
  paragraphNumber,
  paragraphTitle,
  onViewEvidence,
}: FL320EvidenceLinksProps) {
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvidence() {
      try {
        const files = await getEvidenceForParagraph(paragraphNumber);
        setEvidence(files);
      } catch (error) {
        console.error('Error loading evidence for paragraph:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, [paragraphNumber]);

  const getFileIcon = (fileType: FileType) => {
    switch (fileType) {
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Loading evidence...
      </div>
    );
  }

  if (evidence.length === 0) {
    return null; // Don't show anything if no evidence linked
  }

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Evidence for Paragraph {paragraphNumber}
          {paragraphTitle && ` - ${paragraphTitle}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {evidence.map((file) => (
          <div
            key={file.id}
            className="flex items-start gap-3 p-3 bg-white rounded border hover:shadow-sm transition-shadow"
          >
            {/* Icon */}
            <div className="mt-0.5">{getFileIcon(file.file_type)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{file.title}</p>
                  {file.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {file.description}
                    </p>
                  )}
                </div>
                {file.exhibit_letter && (
                  <Badge variant="outline" className="font-bold shrink-0">
                    Ex. {file.exhibit_letter}
                  </Badge>
                )}
              </div>

              {/* Metadata */}
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {file.file_type}
                </Badge>
                {file.authenticated && (
                  <Badge variant="default" className="text-xs bg-green-600">
                    Authenticated
                  </Badge>
                )}
              </div>

              {/* Action */}
              {onViewEvidence && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 mt-2"
                  onClick={() => onViewEvidence(file)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Evidence
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Compact Evidence Badge Component
 * Shows just the exhibit letter as a clickable badge
 */
interface EvidenceBadgeProps {
  paragraphNumber: number;
  onClick?: () => void;
}

export function EvidenceBadge({ paragraphNumber, onClick }: EvidenceBadgeProps) {
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);

  useEffect(() => {
    async function loadEvidence() {
      try {
        const files = await getEvidenceForParagraph(paragraphNumber);
        setEvidence(files);
      } catch (error) {
        console.error('Error loading evidence badge:', error);
      }
    }

    loadEvidence();
  }, [paragraphNumber]);

  if (evidence.length === 0) {
    return null;
  }

  const exhibitLetters = evidence
    .filter(e => e.exhibit_letter)
    .map(e => e.exhibit_letter)
    .join(', ');

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-6 px-2 text-xs font-mono"
      onClick={onClick}
    >
      📎 Ex. {exhibitLetters}
    </Button>
  );
}
