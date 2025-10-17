'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  Calendar, 
  Mail, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface RFOAnalysisData {
  mathematicalErrors: {
    totalInvalidClaims: number;
    percentage: number;
    coreError: string;
  };
  timeline: {
    possessionDate: string;
    daysOfUse: number;
    offsetValue: number;
  };
  exParteFilings: {
    total: number;
    frequency: string;
    impact: string;
  };
  continuances: {
    total: number;
    petitionerRequests: number;
    respondentRequests: number;
    courtRequests: number;
  };
  communications: {
    totalEmails: number;
    petitionerEmails: number;
    respondentEmails: number;
    petitionerResponseTime: number;
    respondentResponseTime: number;
  };
  financialClaims: {
    totalClaims: number;
    invalidClaims: number;
    validClaims: number;
    invalidPercentage: number;
  };
}

const RFOAnalysisPage: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<RFOAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisData({
        mathematicalErrors: {
          totalInvalidClaims: 145780.38,
          percentage: 69,
          coreError: 'Double-counting $77,779.88 mortgage costs'
        },
        timeline: {
          possessionDate: 'November 16, 2024',
          daysOfUse: 196,
          offsetValue: 29250
        },
        exParteFilings: {
          total: 7,
          frequency: '1 filing every 1.7 months',
          impact: 'Aggressive litigation tactics'
        },
        continuances: {
          total: 12,
          petitionerRequests: 8,
          respondentRequests: 3,
          courtRequests: 1
        },
        communications: {
          totalEmails: 47,
          petitionerEmails: 31,
          respondentEmails: 16,
          petitionerResponseTime: 2.3,
          respondentResponseTime: 1.8
        },
        financialClaims: {
          totalClaims: 211097.19,
          invalidClaims: 145780.38,
          validClaims: 65316.81,
          invalidPercentage: 69
        }
      });
      
      setLoading(false);
    };

    loadData();
  }, []);

  const continuanceData = analysisData ? [
    { name: 'Petitioner', value: analysisData.continuances.petitionerRequests, color: '#EF4444' },
    { name: 'Respondent', value: analysisData.continuances.respondentRequests, color: '#8B5CF6' },
    { name: 'Court', value: analysisData.continuances.courtRequests, color: '#3B82F6' }
  ] : [];

  const communicationData = analysisData ? [
    { name: 'Petitioner', emails: analysisData.communications.petitionerEmails, responseTime: analysisData.communications.petitionerResponseTime },
    { name: 'Respondent', emails: analysisData.communications.respondentEmails, responseTime: analysisData.communications.respondentResponseTime }
  ] : [];

  const financialData = analysisData ? [
    { category: 'Invalid Claims', amount: analysisData.financialClaims.invalidClaims, color: '#EF4444' },
    { category: 'Valid Claims', amount: analysisData.financialClaims.validClaims, color: '#10B981' }
  ] : [];

  const exParteTimeline = [
    { date: 'Jun 14, 2024', filing: 'List property for sale', impact: 'High' },
    { date: 'Aug 9, 2024', filing: 'Sole possession', impact: 'High' },
    { date: 'Sep 12, 2024', filing: 'Declutter order', impact: 'Medium' },
    { date: 'Oct 3, 2024', filing: 'Vacate order', impact: 'High' },
    { date: 'Nov 16, 2024', filing: 'Possession enforcement', impact: 'High' },
    { date: 'Apr 22, 2025', filing: 'Elisor signature request', impact: 'Medium' },
    { date: 'May 1, 2025', filing: 'Court signature request', impact: 'Medium' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading RFO analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Failed to load analysis data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <Badge variant="outline" className="text-xs font-semibold text-red-700 border-red-300 bg-red-50">
                Mathematical Impossibility
              </Badge>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            RFO Analysis: Data-Driven Defense
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Forensic analysis of Petitioner's Request for Order revealing fundamental mathematical errors and contradicted claims
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'mathematical', label: 'Mathematical Errors', icon: Calculator },
              { id: 'timeline', label: 'Timeline Analysis', icon: Calendar },
              { id: 'communications', label: 'Communications', icon: Mail },
              { id: 'financial', label: 'Financial Claims', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Invalid Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">
                    ${analysisData.mathematicalErrors.totalInvalidClaims.toLocaleString()}
                  </div>
                  <p className="text-xs text-red-600">
                    {analysisData.mathematicalErrors.percentage}% of total claims
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Ex Parte Filings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {analysisData.exParteFilings.total}
                  </div>
                  <p className="text-xs text-blue-600">
                    {analysisData.exParteFilings.frequency}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Continuances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {analysisData.continuances.petitionerRequests}/{analysisData.continuances.total}
                  </div>
                  <p className="text-xs text-purple-600">
                    Petitioner requests (67%)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {analysisData.communications.respondentResponseTime} days
                  </div>
                  <p className="text-xs text-green-600">
                    vs {analysisData.communications.petitionerResponseTime} days (Petitioner)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Core Mathematical Error */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Mathematical Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">
                    {analysisData.mathematicalErrors.coreError}
                  </p>
                  <p className="text-red-700 text-sm">
                    Petitioner attempts to both deduct and add back the same $77,779.88, 
                    which is mathematically impossible and invalidates her entire calculation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Continuance Attribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={continuanceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {continuanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Financial Claims Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Mathematical Errors Tab */}
        {activeTab === 'mathematical' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-900">
                  Mathematical Impossibility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Petitioner's Impossible Calculation</h4>
                    <div className="text-sm text-red-700 space-y-1">
                      <p>1. Escrow Proceeds: $280,355.83</p>
                      <p>2. "Add Back" Request: +$77,779.88</p>
                      <p>3. Fictional Total: $358,155.71</p>
                      <p className="font-bold text-red-900">❌ MATHEMATICALLY IMPOSSIBLE</p>
                    </div>
                  </div>

                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Correct Calculation</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>1. Gross Sale Price: $1,175,000.00</p>
                      <p>2. Less: Mortgage Payoff: $759,364.32</p>
                      <p>3. Less: Closing Costs: $135,279.85</p>
                      <p>4. Net Proceeds: $280,355.83</p>
                      <p className="font-bold text-green-900">✅ MATHEMATICALLY CORRECT</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Invalid Claims Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { claim: 'Mortgage "Add Back"', amount: 77779.88, issue: 'Mathematically impossible' },
                    { claim: 'Watts Charges (Nov 2024)', amount: 18112.50, issue: 'After possession date' },
                    { claim: 'Attorney Fees Sanctions', amount: 40000.00, issue: 'No bad faith evidence' },
                    { claim: 'Cleanup Costs', amount: 6419.00, issue: 'Insufficient evidence' },
                    { claim: 'Removal Costs', amount: 2470.00, issue: 'Normal wear and tear' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{item.claim}</p>
                        <p className="text-sm text-slate-600">{item.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">${item.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Invalid</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timeline Analysis Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Critical Timeline Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Key Date: November 16, 2024</h4>
                    <p className="text-blue-700 text-sm">
                      Petitioner took exclusive possession of the Property on this date. 
                      This fact is critical because Watts charges end on November 15, 2024, 
                      and all Property-related expenses after this date are Petitioner's responsibility.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">Before November 16, 2024</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Respondent responsible for mortgage</li>
                        <li>• Respondent responsible for taxes</li>
                        <li>• Respondent responsible for insurance</li>
                        <li>• Watts charges apply</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">After November 16, 2024</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Petitioner responsible for mortgage</li>
                        <li>• Petitioner responsible for taxes</li>
                        <li>• Petitioner responsible for insurance</li>
                        <li>• Watts charges END</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ex Parte Filing Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exParteTimeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.filing}</p>
                        <p className="text-sm text-slate-600">{item.date}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.impact === 'High' ? 'border-red-300 text-red-700' : 'border-yellow-300 text-yellow-700'
                        }`}
                      >
                        {item.impact} Impact
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Communication Analysis with Realtor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">Total Communications: 47</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Petitioner:</span>
                          <span className="font-medium text-slate-800">31 emails (66%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Respondent:</span>
                          <span className="font-medium text-slate-800">16 emails (34%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-2">Response Time Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Petitioner:</span>
                          <span className="font-medium text-slate-800">2.3 days average</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Respondent:</span>
                          <span className="font-medium text-green-600">1.8 days average</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={communicationData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="emails" fill="#8884d8" name="Emails" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Communication Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800">Petitioner Communications</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Clear requests:</span>
                        <span className="font-medium text-slate-800">18 (58%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Vague requests:</span>
                        <span className="font-medium text-slate-800">8 (26%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Complaints:</span>
                        <span className="font-medium text-slate-800">4 (13%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Demands:</span>
                        <span className="font-medium text-slate-800">1 (3%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800">Respondent Communications</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Clear responses:</span>
                        <span className="font-medium text-green-600">12 (75%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Questions:</span>
                        <span className="font-medium text-slate-800">3 (19%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Clarifications:</span>
                        <span className="font-medium text-slate-800">1 (6%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Complaints:</span>
                        <span className="font-medium text-green-600">0 (0%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Claims Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Financial Claims Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Invalid Claims: $145,780.38</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600">Mortgage "Add Back":</span>
                          <span className="font-medium text-red-800">$77,779.88</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600">Watts Charges (Nov 2024):</span>
                          <span className="font-medium text-red-800">$18,112.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600">Attorney Fees Sanctions:</span>
                          <span className="font-medium text-red-800">$40,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600">Cleanup Costs:</span>
                          <span className="font-medium text-red-800">$6,419.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600">Removal Costs:</span>
                          <span className="font-medium text-red-800">$2,470.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Valid Claims: $65,316.81</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600">Watts Charges (2021-2023):</span>
                          <span className="font-medium text-green-800">$46,200.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600">Rental Income Share:</span>
                          <span className="font-medium text-green-800">$5,761.81</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600">Motorcycle Share:</span>
                          <span className="font-medium text-green-800">$5,855.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600">Household Items:</span>
                          <span className="font-medium text-green-800">$7,500.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Offset Claims Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Petitioner's Exclusive Use Period</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">196</div>
                        <div className="text-sm text-blue-600">Days of Use</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">6.5</div>
                        <div className="text-sm text-blue-600">Months</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">$29,250</div>
                        <div className="text-sm text-blue-600">Offset Value</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Watts Charges Offset Calculation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Petitioner's Watts Claims:</span>
                        <span className="font-medium text-slate-800">$64,312.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Petitioner's Use Period:</span>
                        <span className="font-medium text-slate-800">196 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Offset Value:</span>
                        <span className="font-medium text-slate-800">$29,250</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-semibold text-slate-800">Net Watts Charges:</span>
                        <span className="font-bold text-green-600">$35,062.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Export Options */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
          <Button
            variant="outline"
            className="border-slate-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RFOAnalysisPage;
