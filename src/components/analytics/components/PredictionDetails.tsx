"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import type { PredictionModel } from '../types';

interface PredictionDetailsProps {
  prediction: PredictionModel;
}

export const PredictionDetails = React.memo<PredictionDetailsProps>(({ prediction }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {prediction.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Prediction Details</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Type:</strong> {prediction.type}</div>
                <div><strong>Confidence:</strong> {prediction.confidence}%</div>
                <div><strong>Weight:</strong> {prediction.weight}</div>
                <div><strong>Last Updated:</strong> {new Date(prediction.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Description</h4>
              <p className="text-sm text-slate-700">{prediction.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">All Factors</h4>
            <div className="space-y-1">
              {prediction.factors.map((factor, index) => (
                <div key={index} className="text-sm text-slate-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {factor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PredictionDetails.displayName = 'PredictionDetails';
