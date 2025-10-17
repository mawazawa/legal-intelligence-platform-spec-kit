"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  PieChart, 
  LineChart,
  Activity,
  Zap,
  Flame,
  Thunder,
  Lightning,
  Rocket,
  Star,
  Crown,
  Diamond,
  Sparkles,
  Award,
  Trophy,
  Calculator,
  Brain,
  Cpu,
  Database,
  Network,
  Layers,
  Settings,
  Filter,
  Search,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Grid,
  Table,
  List,
  Grid3X3,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Plus,
  Minus,
  Equal,
  Divide,
  Multiply,
  AreaChart,
  ScatterChart,
  CandlestickChart,
  RadarChart,
  PolarChart,
  TreemapChart,
  SunburstChart,
  SankeyChart,
  FunnelChart,
  GaugeChart,
  WaterfallChart,
  BoxPlotChart,
  ViolinChart,
  HeatmapChart,
  ContourChart,
  SurfaceChart,
  WireframeChart,
  Scatter3DChart,
  Surface3DChart,
  Bar3DChart,
  Line3DChart,
  Area3DChart,
  Pie3DChart,
  DoughnutChart,
  PolarAreaChart,
  RadarAreaChart,
  BubbleChart,
  Candlestick3DChart,
  Radar3DChart,
  Polar3DChart,
  Treemap3DChart,
  Sunburst3DChart,
  Sankey3DChart,
  Funnel3DChart,
  Gauge3DChart,
  Waterfall3DChart,
  BoxPlot3DChart,
  Violin3DChart,
  Heatmap3DChart,
  Contour3DChart,
  Surface3DChart as Surface3DChartIcon,
  Wireframe3DChart,
  Scatter4DChart,
  Surface4DChart,
  Bar4DChart,
  Line4DChart,
  Area4DChart,
  Pie4DChart,
  Doughnut4DChart,
  PolarArea4DChart,
  RadarArea4DChart,
  Bubble4DChart,
  Candlestick4DChart,
  Radar4DChart,
  Polar4DChart,
  Treemap4DChart,
  Sunburst4DChart,
  Sankey4DChart,
  Funnel4DChart,
  Gauge4DChart,
  Waterfall4DChart,
  BoxPlot4DChart,
  Violin4DChart,
  Heatmap4DChart,
  Contour4DChart,
  Surface4DChart as Surface4DChartIcon2,
  Wireframe4DChart
} from 'lucide-react';

interface PredictionModel {
  id: string;
  name: string;
  type: 'outcome' | 'settlement' | 'timeline' | 'cost' | 'risk';
  confidence: number;
  factors: string[];
  weight: number;
  description: string;
  lastUpdated: string;
}

interface SentimentAnalysis {
  id: string;
  source: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  keywords: string[];
  date: string;
}

interface PredictiveModelsProps {
  evidenceData: any[];
  onPredictionClick?: (prediction: PredictionModel) => void;
}

const PredictiveModels: React.FC<PredictiveModelsProps> = ({
  evidenceData,
  onPredictionClick
}) => {
  const [predictions, setPredictions] = useState<PredictionModel[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [activeModel, setActiveModel] = useState<string>('outcome');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionModel | null>(null);

  // Initialize predictive models
  useEffect(() => {
    const models: PredictionModel[] = [
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

    setPredictions(models);
  }, [evidenceData]);

  // Initialize sentiment analysis
  useEffect(() => {
    const sentiment: SentimentAnalysis[] = [
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

    setSentimentData(sentiment);
  }, [evidenceData]);

  const getPredictionColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-700 bg-green-100 border-green-300';
    if (confidence >= 60) return 'text-blue-700 bg-blue-100 border-blue-300';
    if (confidence >= 40) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-700 bg-green-100 border-green-300';
      case 'negative': return 'text-red-700 bg-red-100 border-red-300';
      case 'neutral': return 'text-gray-700 bg-gray-100 border-gray-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4" />;
      case 'negative': return <ThumbsDown className="h-4 w-4" />;
      case 'neutral': return <Meh className="h-4 w-4" />;
      default: return <Meh className="h-4 w-4" />;
    }
  };

  const filteredPredictions = predictions.filter(p => p.type === activeModel);

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-lg border">
        <Button
          variant={activeModel === 'outcome' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveModel('outcome')}
        >
          <Target className="h-4 w-4" />
          Outcome
        </Button>
        <Button
          variant={activeModel === 'settlement' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveModel('settlement')}
        >
          <TrendingUp className="h-4 w-4" />
          Settlement
        </Button>
        <Button
          variant={activeModel === 'timeline' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveModel('timeline')}
        >
          <Activity className="h-4 w-4" />
          Timeline
        </Button>
        <Button
          variant={activeModel === 'cost' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveModel('cost')}
        >
          <Calculator className="h-4 w-4" />
          Cost
        </Button>
        <Button
          variant={activeModel === 'risk' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveModel('risk')}
        >
          <Shield className="h-4 w-4" />
          Risk
        </Button>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPredictions.map((prediction) => (
          <Card 
            key={prediction.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedPrediction(prediction);
              onPredictionClick?.(prediction);
            }}
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
        ))}
      </div>

      {/* Sentiment Analysis */}
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
              <div key={sentiment.id} className="border border-slate-200 rounded-lg p-4">
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Prediction Details */}
      {selectedPrediction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {selectedPrediction.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Prediction Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Type:</strong> {selectedPrediction.type}</div>
                    <div><strong>Confidence:</strong> {selectedPrediction.confidence}%</div>
                    <div><strong>Weight:</strong> {selectedPrediction.weight}</div>
                    <div><strong>Last Updated:</strong> {new Date(selectedPrediction.lastUpdated).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Description</h4>
                  <p className="text-sm text-slate-700">{selectedPrediction.description}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">All Factors</h4>
                <div className="space-y-1">
                  {selectedPrediction.factors.map((factor, index) => (
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
      )}
    </div>
  );
};

export default PredictiveModels;
