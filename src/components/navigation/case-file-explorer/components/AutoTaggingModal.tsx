'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, AlertCircle, Loader2, Wand2, CheckCircle } from 'lucide-react';
import { CaseFile } from '../types';
import { AutoTaggingResult } from '@/lib/services/autoTaggingService';

interface AutoTaggingModalProps {
  isOpen: boolean;
  selectedFiles: CaseFile[];
  taggingResults: AutoTaggingResult[];
  isProcessing: boolean;
  error: string | null;
  onClose: () => void;
  onAnalyze: () => void;
  onApply: () => void;
}

export const AutoTaggingModal = React.memo<AutoTaggingModalProps>(({
  isOpen,
  selectedFiles,
  taggingResults,
  isProcessing,
  error,
  onClose,
  onAnalyze,
  onApply
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            Auto-Tagging Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Analyzing {selectedFiles.length} files for automatic tagging and renaming...
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
                const file = selectedFiles[index];
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {taggingResults.length === 0 && (
            <Button onClick={onAnalyze} disabled={isProcessing}>
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
            <Button onClick={onApply}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Results
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

AutoTaggingModal.displayName = 'AutoTaggingModal';
