'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Download,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';

interface ContinuanceEvent {
  id: string;
  date: string;
  actor: 'petitioner' | 'respondent' | 'court' | 'attorney' | 'other';
  reason?: string;
  durationDays?: number;
  description: string;
  source: string;
  snippet: string;
}

interface ContinuanceStats {
  totalContinuances: number;
  totalDelayDays: number;
  byActor: Record<string, number>;
  byReason: Record<string, number>;
  timeline: ContinuanceEvent[];
}

const ContinuancesAnalytics: React.FC = () => {
  const [stats, setStats] = useState<ContinuanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [filterActor, setFilterActor] = useState<string>('all');

  // Mock data for demonstration - replace with real API call
  const mockStats: ContinuanceStats = useMemo(() => ({
    totalContinuances: 23,
    totalDelayDays: 187,
    byActor: {
      petitioner: 12,
      respondent: 3,
      court: 6,
      attorney: 2
    },
    byReason: {
      'Attorney availability': 8,
      'Medical reasons': 5,
      'Discovery issues': 4,
      'Settlement discussions': 3,
      'Emergency': 2,
      'Unknown': 1
    },
    timeline: [
      {
        id: '1',
        date: '2024-03-15',
        actor: 'petitioner',
        reason: 'Attorney availability',
        durationDays: 14,
        description: 'Motion for continuance - attorney conflict',
        source: 'Email correspondence',
        snippet: 'Requesting continuance due to attorney scheduling conflict...'
      },
      {
        id: '2',
        date: '2024-04-02',
        actor: 'court',
        reason: 'Emergency',
        durationDays: 7,
        description: 'Court ordered continuance - emergency',
        source: 'ROA Entry',
        snippet: 'Court ordered continuance due to emergency...'
      },
      {
        id: '3',
        date: '2024-04-20',
        actor: 'petitioner',
        reason: 'Medical reasons',
        durationDays: 21,
        description: 'Continuance request - medical emergency',
        source: 'Email correspondence',
        snippet: 'Requesting continuance due to medical emergency...'
      },
      {
        id: '4',
        date: '2024-05-10',
        actor: 'respondent',
        reason: 'Discovery issues',
        durationDays: 14,
        description: 'Motion for continuance - discovery',
        source: 'Filing',
        snippet: 'Requesting continuance to complete discovery...'
      },
      {
        id: '5',
        date: '2024-05-25',
        actor: 'petitioner',
        reason: 'Settlement discussions',
        durationDays: 30,
        description: 'Continuance for settlement negotiations',
        source: 'Email correspondence',
        snippet: 'Requesting continuance to pursue settlement...'
      }
    ]
  }), []);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      try {
        // TODO: Replace with real API call
        // const response = await fetch('/api/analytics/continuances');
        // const data = await response.json();
        // setStats(data);
        
        // Use mock data for now
        setTimeout(() => {
          setStats(mockStats);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching continuance stats:', error);
        setStats(mockStats);
        setLoading(false);
      }
    };

    fetchStats();
  }, [mockStats]);

  const filteredTimeline = useMemo(() => {
    if (!stats) return [];
    
    if (filterActor === 'all') {
      return stats.timeline;
    }
    
    return stats.timeline.filter(event => event.actor === filterActor);
  }, [stats, filterActor]);

  const actorColors = {
    petitioner: 'bg-red-100 border-red-300 text-red-800',
    respondent: 'bg-purple-100 border-purple-300 text-purple-800',
    court: 'bg-blue-100 border-blue-300 text-blue-800',
    attorney: 'bg-green-100 border-green-300 text-green-800',
    other: 'bg-gray-100 border-gray-300 text-gray-800'
  };

  const exportToCSV = () => {
    if (!stats) return;
    
    const csvContent = [
      'Date,Actor,Reason,Duration Days,Description,Source',
      ...stats.timeline.map(event => 
        `"${event.date}","${event.actor}","${event.reason || 'N/A'}","${event.durationDays || 'N/A'}","${event.description}","${event.source}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'continuances-analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Continuances Analysis</h1>
            <p className="text-slate-600">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Continuances Attribution Analysis</h1>
          <p className="text-slate-600">Visual analysis of delays and continuances in the legal proceedings</p>
        </div>

        {/* Top-line Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Total Continuances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalContinuances}</div>
              <p className="text-xs text-slate-500 mt-1">All continuances</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Total Delay Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalDelayDays}</div>
              <p className="text-xs text-slate-500 mt-1">Days of delay</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Petitioner Continuances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.byActor.petitioner || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Red color attribution</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Average Delay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {Math.round(stats.totalDelayDays / stats.totalContinuances)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Days per continuance</p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Actor Attribution Chart */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Continuances by Actor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byActor).map(([actor, count]) => (
                  <div key={actor} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        actor === 'petitioner' ? 'bg-red-500' :
                        actor === 'respondent' ? 'bg-purple-500' :
                        actor === 'court' ? 'bg-blue-500' :
                        actor === 'attorney' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium text-slate-700 capitalize">{actor}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{count}</div>
                      <div className="text-xs text-slate-500">
                        {Math.round((count / stats.totalContinuances) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reason Breakdown */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Continuances by Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byReason).map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3 bg-slate-400"></div>
                      <span className="text-sm font-medium text-slate-700">{reason}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{count}</div>
                      <div className="text-xs text-slate-500">
                        {Math.round((count / stats.totalContinuances) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline and Details */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800">Continuance Timeline</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  value={filterActor}
                  onChange={(e) => setFilterActor(e.target.value)}
                  className="text-sm border border-slate-300 rounded px-2 py-1"
                >
                  <option value="all">All Actors</option>
                  <option value="petitioner">Petitioner</option>
                  <option value="respondent">Respondent</option>
                  <option value="court">Court</option>
                  <option value="attorney">Attorney</option>
                </select>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  size="sm"
                >
                  {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTimeline.map((event) => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 ${
                    actorColors[event.actor] || actorColors.other
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {event.date}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {event.actor}
                        </Badge>
                        {event.reason && (
                          <Badge variant="outline" className="text-xs">
                            {event.reason}
                          </Badge>
                        )}
                        {event.durationDays && (
                          <Badge variant="outline" className="text-xs">
                            {event.durationDays} days
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-slate-800 mb-1">{event.description}</h4>
                      {showDetails && (
                        <div className="mt-2">
                          <p className="text-sm text-slate-600 mb-1">
                            <strong>Source:</strong> {event.source}
                          </p>
                          <p className="text-sm text-slate-600 italic">
                            "{event.snippet}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Claims vs Reality Panel */}
        <Card className="bg-white shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Claims vs Reality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">Petitioner's Claim</h4>
                <p className="text-sm text-red-700 italic">
                  "Respondent has prolonged the legal proceedings through multiple continuances..."
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">Reality</h4>
                <p className="text-sm text-green-700">
                  <strong>Petitioner:</strong> {stats.byActor.petitioner || 0} continuances<br/>
                  <strong>Respondent:</strong> {stats.byActor.respondent || 0} continuances<br/>
                  <strong>Court:</strong> {stats.byActor.court || 0} continuances
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContinuancesAnalytics;
