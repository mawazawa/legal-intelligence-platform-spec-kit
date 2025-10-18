export interface PredictionModel {
  id: string;
  name: string;
  type: 'outcome' | 'settlement' | 'timeline' | 'cost' | 'risk';
  confidence: number;
  factors: string[];
  weight: number;
  description: string;
  lastUpdated: string;
}

export interface SentimentAnalysis {
  id: string;
  source: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  keywords: string[];
  date: string;
}
