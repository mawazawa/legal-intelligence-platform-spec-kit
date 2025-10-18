'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MessageSquare, Search, FileText } from 'lucide-react';
import { logger } from '@/lib/logging/logger';

interface Annotation {
  id: string;
  claim: string;
  annotation: string;
  timestamp: Date;
  evidence?: string[];
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'timestamp'>) => void;
  onSearchEvidence: (query: string) => Promise<string[]>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  annotations,
  onAddAnnotation,
  onSearchEvidence
}) => {
  const [claim, setClaim] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = () => {
    if (claim.trim() && annotation.trim()) {
      onAddAnnotation({
        claim: claim.trim(),
        annotation: annotation.trim(),
        evidence: searchResults
      });
      setClaim('');
      setAnnotation('');
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  /**
   * Search for evidence matching the query
   */
  const handleSearchEvidence = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      logger.debug('Searching for evidence', { query: searchQuery });
      const results = await onSearchEvidence(searchQuery);
      setSearchResults(results);
      logger.debug('Evidence search completed', { resultCount: results.length });
    } catch (error) {
      logger.error('Evidence search failed', error as Error);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Claim Analysis & Annotations
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Annotations */}
          {annotations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Existing Annotations</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {annotations.map((ann) => (
                  <div key={ann.id} className="bg-gray-50 p-3 rounded border">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {ann.timestamp.toLocaleTimeString()}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{ann.claim}</p>
                    <p className="text-xs text-gray-600">{ann.annotation}</p>
                    {ann.evidence && ann.evidence.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Evidence:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {ann.evidence.map((ev, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Annotation Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Add New Annotation</h3>
            
            <div>
              <Label htmlFor="claim">Petitioner's Claim</Label>
              <Input
                id="claim"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter the specific claim to analyze..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="annotation">Your Analysis</Label>
              <Textarea
                id="annotation"
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                placeholder="Provide your analysis, counter-arguments, or questions..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            {/* Evidence Search */}
            <div>
              <Label htmlFor="search">Search Email Evidence (Optional)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for evidence in emails..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchEvidence()}
                />
                <Button
                  onClick={handleSearchEvidence}
                  disabled={isSearching || !searchQuery.trim()}
                  size="sm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 rounded border">
                  <p className="text-sm font-medium text-blue-800 mb-2">Search Results:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {searchResults.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={!claim.trim() || !annotation.trim()}>
                Add Annotation
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackModal;
