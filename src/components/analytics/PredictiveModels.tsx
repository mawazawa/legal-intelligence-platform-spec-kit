"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import type { PredictionModel } from './types';
import { mockPredictions, mockSentiment } from './data/mockData';
import { ModelSelector } from './components/ModelSelector';
import { PredictionCard } from './components/PredictionCard';
import { SentimentCard } from './components/SentimentCard';
import { PredictionDetails } from './components/PredictionDetails';

interface PredictiveModelsProps {
  evidenceData?: any[];
  onPredictionClick?: (prediction: PredictionModel) => void;
}

const PredictiveModels: React.FC<PredictiveModelsProps> = ({
  evidenceData,
  onPredictionClick
}) => {
  const [predictions, setPredictions] = useState<PredictionModel[]>([]);
  const [sentimentData, setSentimentData] = useState(mockSentiment);
  const [activeModel, setActiveModel] = useState<string>('outcome');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionModel | null>(null);

  useEffect(() => {
    if (!evidenceData) return;
    setPredictions(mockPredictions);
  }, [evidenceData]);

  const handlePredictionClick = (prediction: PredictionModel) => {
    setSelectedPrediction(prediction);
    onPredictionClick?.(prediction);
  };

  const filteredPredictions = predictions.filter(p => p.type === activeModel);

  return (
    <div className="space-y-6">
      <ModelSelector activeModel={activeModel} onModelChange={setActiveModel} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPredictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            onClick={handlePredictionClick}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentData.map((sentiment) => (
              <SentimentCard key={sentiment.id} sentiment={sentiment} />
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPrediction && <PredictionDetails prediction={selectedPrediction} />}
    </div>
  );
};

export default PredictiveModels;
