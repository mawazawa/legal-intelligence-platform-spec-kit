'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Mail,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Scale,
  Target,
  Award,
  Info,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Users,
  Clock,
  Zap
} from 'lucide-react';

// Lazy load chart components
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
const BarChart = lazy(() => import('recharts').then(mod => ({ default: mod.BarChart })));
const Bar = lazy(() => import('recharts').then(mod => ({ default: mod.Bar })));
const XAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const YAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis })));
const Tooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));
const Legend = lazy(() => import('recharts').then(mod => ({ default: mod.Legend })));
const PieChart = lazy(() => import('recharts').then(mod => ({ default: mod.PieChart })));
const Pie = lazy(() => import('recharts').then(mod => ({ default: mod.Pie })));
const Cell = lazy(() => import('recharts').then(mod => ({ default: mod.Cell })));
const LineChart = lazy(() => import('recharts').then(mod => ({ default: mod.LineChart })));
const Line = lazy(() => import('recharts').then(mod => ({ default: mod.Line })));

interface KarmaAnalysis {
  actor: 'petitioner' | 'respondent' | 'court';
  totalDelays: number;
  totalDelayDays: number;
  cooperationScore: number;
  contradictionCount: number;
  financialInconsistencies: number;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
}

interface TimelineEvent {
  date: string;
  actor: string;
  action: string;
  impact: 'positive' | 'negative' | 'neutral';
  evidence: string;
  contradiction?: string;
}

interface EvidenceItem {
  type: 'email' | 'document' | 'financial' | 'timeline';
  source: string;
  content: string;
  relevance: number;
  contradiction?: string;
}

interface AnalysisSummary {
  totalAnalyses: number;
  totalDelays: number;
  totalDelayDays: number;
  avgCooperationScore: number;
  totalContradictions: number;
  totalFinancialInconsistencies: number;
  courtReadyReport: string;
}

export default function KarmaBoomerangPage() {
  const [analyses, setAnalyses] = useState<KarmaAnalysis[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActor, setSelectedActor] = useState<'petitioner' | 'respondent' | null>(null);

  useEffect(() => {
    fetchKarmaAnalysis();
  }, []);

  const fetchKarmaAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/karma-boomerang');
      const data = await response.json();

      if (data.success) {
        setAnalyses(data.data.analyses);
        setSummary(data.data.summary);
      } else {
        setError(data.error || 'Failed to fetch karma analysis');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching karma analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalysis = () => {
    if (!summary) return;
    
    const report = summary.courtReadyReport;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karma-boomerang-analysis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const selectedAnalysis = selectedActor ? analyses.find(a => a.actor === selectedActor) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Karma Boomerang Analysis</h1>
          <p className="text-gray-600 mt-2">
            Surgical analysis of opponent behavior using email mbox data and knowledge graph
          </p>
        </div>
        <Button onClick={exportAnalysis} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Delays</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalDelays}</div>
              <p className="text-xs text-muted-foreground">
                {summary.totalDelayDays} total delay days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cooperation Score</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.avgCooperationScore.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Average across all actors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contradictions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalContradictions}</div>
              <p className="text-xs text-muted-foreground">
                Inconsistent statements found
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Financial Issues</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalFinancialInconsistencies}</div>
              <p className="text-xs text-muted-foreground">
                Financial inconsistencies
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actor Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Actor for Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {analyses.map((analysis) => (
              <Button
                key={analysis.actor}
                variant={selectedActor === analysis.actor ? "default" : "outline"}
                onClick={() => setSelectedActor(analysis.actor)}
              >
                {analysis.actor.charAt(0).toUpperCase() + analysis.actor.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      {selectedAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline of Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedAnalysis.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getImpactIcon(event.impact)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.action}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.evidence}</p>
                      {event.contradiction && (
                        <Badge variant="destructive" className="mt-2">
                          {event.contradiction}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Key Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedAnalysis.evidence.slice(0, 10).map((evidence, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{evidence.type}</Badge>
                      <span className="text-sm text-gray-500">
                        Relevance: {(evidence.relevance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{evidence.content}</p>
                    {evidence.contradiction && (
                      <Badge variant="destructive" className="mt-2">
                        {evidence.contradiction}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Suspense fallback={<div>Loading charts...</div>}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cooperation Score Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cooperation Scores by Actor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyses}>
                  <XAxis dataKey="actor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cooperationScore" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delay Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Delay Analysis by Actor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyses}>
                  <XAxis dataKey="actor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalDelays" fill="#ef4444" />
                  <Bar dataKey="totalDelayDays" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Court-Ready Report */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Court-Ready Analysis Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {summary.courtReadyReport}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
