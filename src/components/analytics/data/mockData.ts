import type { PredictionModel, SentimentAnalysis } from '../types';

export const mockPredictions: PredictionModel[] = [
  {
    id: 'outcome-001',
    name: 'Case Outcome Prediction',
    type: 'outcome',
    confidence: 87,
    factors: ['Mathematical errors in Petitioner\'s RFO', 'Respondent\'s airtight timeline evidence', 'Legal precedent support'],
    weight: 0.35,
    description: 'High probability of Respondent success based on mathematical impossibility of Petitioner\'s claims',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'settlement-001',
    name: 'Settlement Probability',
    type: 'settlement',
    confidence: 72,
    factors: ['Petitioner\'s weak evidence', 'Respondent\'s strong legal position', 'Cost-benefit analysis'],
    weight: 0.25,
    description: 'Moderate settlement probability due to Petitioner\'s weak position',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'timeline-001',
    name: 'Resolution Timeline',
    type: 'timeline',
    confidence: 81,
    factors: ['Court calendar', 'Evidence strength', 'Legal complexity'],
    weight: 0.20,
    description: 'Expected resolution within 3-6 months',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'cost-001',
    name: 'Legal Cost Prediction',
    type: 'cost',
    confidence: 76,
    factors: ['Case complexity', 'Evidence volume', 'Settlement likelihood'],
    weight: 0.15,
    description: 'Estimated legal costs: $15,000-$25,000',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'risk-001',
    name: 'Risk Assessment',
    type: 'risk',
    confidence: 84,
    factors: ['Evidence quality', 'Legal precedent', 'Judge bias'],
    weight: 0.05,
    description: 'Low risk due to strong evidence and legal precedent',
    lastUpdated: new Date().toISOString()
  }
];

export const mockSentiment: SentimentAnalysis[] = [
  {
    id: 'sent-001',
    source: 'Petitioner RFO',
    text: 'Petitioner claims mathematical impossibility and seeks redistribution',
    sentiment: 'negative',
    confidence: 89,
    emotions: ['frustration', 'entitlement', 'defensiveness'],
    keywords: ['mathematical error', 'impossible', 'redistribution'],
    date: new Date().toISOString()
  },
  {
    id: 'sent-002',
    source: 'Respondent Declaration',
    text: 'Respondent demonstrates Petitioner\'s claims are mathematically impossible',
    sentiment: 'positive',
    confidence: 92,
    emotions: ['confidence', 'clarity', 'determination'],
    keywords: ['mathematically impossible', 'demonstrates', 'legally unsupportable'],
    date: new Date().toISOString()
  },
  {
    id: 'sent-003',
    source: 'Court Communications',
    text: 'Professional communication regarding case timeline and procedures',
    sentiment: 'neutral',
    confidence: 78,
    emotions: ['professionalism', 'neutrality', 'efficiency'],
    keywords: ['timeline', 'procedures', 'professional'],
    date: new Date().toISOString()
  }
];
