'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, Eye, Download, AlertCircle, Bot } from 'lucide-react';
import { CaseFile } from '../types';
import { getFileIcon, getRelevanceColor } from '../utils/fileUtils';

interface FileCardProps {
  file: CaseFile;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export const FileCard = React.memo<FileCardProps>(({ file, isSelected, onSelect, onOpen }) => {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      } ${file.needsReview ? 'border-orange-200 bg-orange-50' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {getFileIcon(file.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">
                {file.name}
              </h4>
              <Badge variant="outline" className={`text-xs ${getRelevanceColor(file.relevance)}`}>
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
                  onOpen();
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
  );
});

FileCard.displayName = 'FileCard';
