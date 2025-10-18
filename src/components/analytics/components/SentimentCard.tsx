"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import type { SentimentAnalysis } from '../types';
import { getSentimentColor } from '../utils';

interface SentimentCardProps {
  sentiment: SentimentAnalysis;
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return <ThumbsUp className="h-4 w-4" />;
    case 'negative': return <ThumbsDown className="h-4 w-4" />;
    case 'neutral': return <Meh className="h-4 w-4" />;
    default: return <Meh className="h-4 w-4" />;
  }
};

export const SentimentCard = React.memo<SentimentCardProps>(({ sentiment }) => {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge className={getSentimentColor(sentiment.sentiment)}>
            {getSentimentIcon(sentiment.sentiment)}
            <span className="ml-1 capitalize">{sentiment.sentiment}</span>
          </Badge>
          <span className="text-sm font-medium">{sentiment.source}</span>
        </div>
        <div className="text-sm text-slate-500">
          {sentiment.confidence}% confidence
        </div>
      </div>

      <p className="text-sm text-slate-700 mb-3">{sentiment.text}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-1">Emotions:</h4>
          <div className="flex flex-wrap gap-1">
            {sentiment.emotions.map((emotion) => (
              <Badge key={emotion} variant="secondary" className="text-xs">
                {emotion}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-1">Keywords:</h4>
          <div className="flex flex-wrap gap-1">
            {sentiment.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

SentimentCard.displayName = 'SentimentCard';
