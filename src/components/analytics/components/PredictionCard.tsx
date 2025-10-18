"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { PredictionModel } from '../types';
import { getPredictionColor } from '../utils';

interface PredictionCardProps {
  prediction: PredictionModel;
  onClick: (prediction: PredictionModel) => void;
}

export const PredictionCard = React.memo<PredictionCardProps>(({ prediction, onClick }) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(prediction)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm">{prediction.name}</span>
          <Badge className={getPredictionColor(prediction.confidence)}>
            {prediction.confidence}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Confidence</span>
              <span>{prediction.confidence}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2" />
          </div>

          <p className="text-sm text-slate-600">{prediction.description}</p>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-700">Key Factors:</h4>
            {prediction.factors.slice(0, 2).map((factor, index) => (
              <div key={index} className="text-xs text-slate-600 flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                {factor}
              </div>
            ))}
            {prediction.factors.length > 2 && (
              <div className="text-xs text-slate-500">
                +{prediction.factors.length - 2} more factors
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PredictionCard.displayName = 'PredictionCard';
