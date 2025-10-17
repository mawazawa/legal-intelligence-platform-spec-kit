'use client';

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/styles/typography';
import PageSkeleton, { ChartSkeleton } from '@/components/loading/PageSkeleton';
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
  Scale,
  Target,
  Award,
  Info,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

// Lazy load chart components to reduce initial bundle size
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
const CartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })));

interface SourceCitation {
  document: string;
  page?: number;
  section?: string;
  date?: string;
  type: 'court_order' | 'settlement_stmt' | 'rfo' | 'email' | 'roa' | 'declaration' | 'exhibit';
}

interface ClaimItem {
  description: string;
  amount: number;
  status: 'valid' | 'invalid' | 'disputed';
  reason?: string;
  sources: SourceCitation[];
  calculation?: string;
}

interface RFOAnalysisData {
  summary: {
    totalPetitionerClaims: number;
    totalInvalidClaims: number;
    totalValidClaims: number;
    netRespondentPosition: number;
    invalidPercentage: number;
    analysisDate: string;
  };
  mathematicalErrors: {
    totalInvalidClaims: number;
    percentage: number;
    coreError: string;
    detailedExplanation: string;
    sources: SourceCitation[];
  };
  propertyDetails: {
    address: string;
    salePrice: number;
    saleDate: string;
    mortgagePayoff: number;
    closingCosts: number;
    netProceeds: number;
    sources: SourceCitation[];
  };
  timeline: {
    possessionDate: string;
    daysOfUse: number;
    offsetValue: number;
    calculationMethod: string;
    sources: SourceCitation[];
  };
  exParteFilings: {
    total: number;
    frequency: string;
    impact: string;
    filings: Array<{
      date: string;
      filing: string;
      impact: 'high' | 'medium' | 'low';
      source: SourceCitation;
    }>;
  };
  continuances: {
    total: number;
    petitionerRequests: number;
    respondentRequests: number;
    courtRequests: number;
    sources: SourceCitation[];
  };
  communications: {
    totalEmails: number;
    petitionerEmails: number;
    respondentEmails: number;
    petitionerResponseTime: number;
    respondentResponseTime: number;
    sources: SourceCitation[];
  };
  claims: {
    invalid: ClaimItem[];
    valid: ClaimItem[];
    disputed: ClaimItem[];
  };
  proposedDistribution: {
    netProceeds: number;
    petitionerShare: number;
    respondentShare: number;
    basis: string;
    sources: SourceCitation[];
  };
}

// Type colors constant (outside component for performance)
const TYPE_COLORS = {
  court_order: 'bg-purple-100 text-purple-700 border-purple-300',
  settlement_stmt: 'bg-blue-100 text-blue-700 border-blue-300',
  rfo: 'bg-red-100 text-red-700 border-red-300',
  email: 'bg-green-100 text-green-700 border-green-300',
  roa: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  declaration: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  exhibit: 'bg-pink-100 text-pink-700 border-pink-300'
} as const;

// Helper Component: Source Citation Badge (memoized)
const SourceCitationBadge = React.memo<{ source: SourceCitation }>(({ source }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${TYPE_COLORS[source.type]} text-xs font-medium`}>
      <FileText className="h-3 w-3" />
      <span>{source.document}</span>
      {source.page && <span className="opacity-70">• p.{source.page}</span>}
      {source.section && <span className="opacity-70 text-[10px]">({source.section})</span>}
    </div>
  );
});
SourceCitationBadge.displayName = 'SourceCitationBadge';

// Helper Component: Sources List (memoized)
const SourcesList = React.memo<{ sources: SourceCitation[]; title?: string }>(({ sources, title = 'Sources' }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className={`${typography.label.small} text-slate-600 mb-2 flex items-center gap-1`}>
        <Info className="h-3 w-3" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, idx) => (
          <SourceCitationBadge key={idx} source={source} />
        ))}
      </div>
    </div>
  );
});
SourcesList.displayName = 'SourcesList';

const RFOAnalysisPage: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<RFOAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // TODO: Replace with real API call to /api/rfo-analysis
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalysisData({
        summary: {
          totalPetitionerClaims: 211097.19,
          totalInvalidClaims: 145780.38,
          totalValidClaims: 65316.81,
          netRespondentPosition: 75460.31,
          invalidPercentage: 69,
          analysisDate: new Date().toISOString()
        },
        mathematicalErrors: {
          totalInvalidClaims: 145780.38,
          percentage: 69,
          coreError: 'Double-counting $77,779.88 mortgage costs',
          detailedExplanation: 'Petitioner attempts to both deduct the mortgage payoff from sale proceeds AND add it back as a separate community debt. This is mathematically impossible and constitutes double-counting. The mortgage was already paid from escrow proceeds, so it cannot be "added back" to the distribution calculation.',
          sources: [
            {
              document: 'Petitioner\'s RFO',
              page: 8,
              section: 'Schedule of Assets and Debts',
              date: '2025-01-15',
              type: 'rfo'
            },
            {
              document: 'Settlement Statement (HUD-1)',
              page: 1,
              section: 'Line 504 - Payoff of first mortgage',
              date: '2024-05-31',
              type: 'settlement_stmt'
            }
          ]
        },
        propertyDetails: {
          address: '123 Main Street, City, CA 12345',
          salePrice: 1175000.00,
          saleDate: '2024-05-31',
          mortgagePayoff: 759364.32,
          closingCosts: 135279.85,
          netProceeds: 280355.83,
          sources: [
            {
              document: 'Final Settlement Statement',
              page: 1,
              date: '2024-05-31',
              type: 'settlement_stmt'
            }
          ]
        },
        timeline: {
          possessionDate: 'November 16, 2024',
          daysOfUse: 196,
          offsetValue: 29250,
          calculationMethod: 'Fair rental value at $4,500/month × 6.5 months (196 days)',
          sources: [
            {
              document: 'Court Order Re: Possession',
              page: 2,
              date: '2024-11-16',
              type: 'court_order'
            }
          ]
        },
        exParteFilings: {
          total: 7,
          frequency: '1 filing every 1.7 months',
          impact: 'Aggressive litigation tactics',
          filings: [
            {
              date: '2024-06-14',
              filing: 'Ex Parte Application to List Property for Sale',
              impact: 'high',
              source: { document: 'ROA Entry #45', date: '2024-06-14', type: 'roa' }
            },
            {
              date: '2024-08-09',
              filing: 'Ex Parte Application for Sole Possession',
              impact: 'high',
              source: { document: 'ROA Entry #52', date: '2024-08-09', type: 'roa' }
            },
            {
              date: '2024-09-12',
              filing: 'Ex Parte Application for Declutter Order',
              impact: 'medium',
              source: { document: 'ROA Entry #58', date: '2024-09-12', type: 'roa' }
            },
            {
              date: '2024-10-03',
              filing: 'Ex Parte Application to Vacate Property',
              impact: 'high',
              source: { document: 'ROA Entry #63', date: '2024-10-03', type: 'roa' }
            },
            {
              date: '2024-11-16',
              filing: 'Ex Parte Application for Possession Enforcement',
              impact: 'high',
              source: { document: 'ROA Entry #71', date: '2024-11-16', type: 'roa' }
            },
            {
              date: '2025-04-22',
              filing: 'Ex Parte Application for Elisor Signature',
              impact: 'medium',
              source: { document: 'ROA Entry #89', date: '2025-04-22', type: 'roa' }
            },
            {
              date: '2025-05-01',
              filing: 'Ex Parte Application for Court Signature',
              impact: 'medium',
              source: { document: 'ROA Entry #92', date: '2025-05-01', type: 'roa' }
            }
          ]
        },
        continuances: {
          total: 12,
          petitionerRequests: 8,
          respondentRequests: 3,
          courtRequests: 1,
          sources: [
            {
              document: 'Register of Actions (Full)',
              type: 'roa'
            }
          ]
        },
        communications: {
          totalEmails: 47,
          petitionerEmails: 31,
          respondentEmails: 16,
          petitionerResponseTime: 2.3,
          respondentResponseTime: 1.8,
          sources: [
            {
              document: 'Email Thread with Realtor (Complete)',
              date: '2024-01-01 to 2024-05-31',
              type: 'email'
            }
          ]
        },
        claims: {
          invalid: [
            {
              description: 'Mortgage Payoff "Add Back"',
              amount: 77779.88,
              status: 'invalid',
              reason: 'Mathematically impossible - mortgage already deducted from sale proceeds',
              calculation: 'Petitioner\'s share of mortgage ($759,364.32 ÷ 2) = $379,682.16. Amount already paid: $301,902.28. Difference claimed: $77,779.88',
              sources: [
                { document: 'Petitioner\'s RFO', page: 8, type: 'rfo' },
                { document: 'Settlement Statement', page: 1, section: 'Line 504', type: 'settlement_stmt' }
              ]
            },
            {
              description: 'Watts Charges for November 2024',
              amount: 18112.50,
              status: 'invalid',
              reason: 'Accrued after Petitioner took exclusive possession on November 16, 2024',
              calculation: '$4,500/month × 4.025 months (Nov 16 - Mar 31, 2024)',
              sources: [
                { document: 'Court Order Re: Possession', page: 2, date: '2024-11-16', type: 'court_order' },
                { document: 'Petitioner\'s RFO', page: 12, section: 'Watts Charges', type: 'rfo' }
              ]
            },
            {
              description: 'Attorney Fees Sanctions',
              amount: 40000.00,
              status: 'invalid',
              reason: 'No evidence of bad faith conduct; Respondent exercised legal rights to defend',
              sources: [
                { document: 'Petitioner\'s RFO', page: 15, type: 'rfo' }
              ]
            },
            {
              description: 'Property Cleanup Costs',
              amount: 6419.00,
              status: 'invalid',
              reason: 'Insufficient evidence; normal wear and tear; property left in reasonable condition',
              sources: [
                { document: 'Petitioner\'s Declaration', page: 4, type: 'declaration' },
                { document: 'Photos - Exhibit C', type: 'exhibit' }
              ]
            },
            {
              description: 'Removal and Disposal Costs',
              amount: 2470.00,
              status: 'invalid',
              reason: 'No itemized receipts provided; claimed costs excessive',
              sources: [
                { document: 'Petitioner\'s Declaration', page: 5, type: 'declaration' }
              ]
            },
            {
              description: 'Storage Unit Costs',
              amount: 999.00,
              status: 'invalid',
              reason: 'Personal choice to store items; not community expense',
              sources: [
                { document: 'Petitioner\'s RFO', page: 14, type: 'rfo' }
              ]
            }
          ],
          valid: [
            {
              description: 'Watts Charges (May 2021 - November 15, 2024)',
              amount: 46200.00,
              status: 'valid',
              calculation: '$4,500/month × 10.27 months (pre-possession period)',
              sources: [
                { document: 'Petitioner\'s RFO', page: 12, type: 'rfo' },
                { document: 'Court Order Re: Possession', date: '2024-11-16', type: 'court_order' }
              ]
            },
            {
              description: 'Rental Income from Boarders (50% share)',
              amount: 5761.81,
              status: 'valid',
              calculation: 'Total rental income: $11,523.62 ÷ 2',
              sources: [
                { document: 'Petitioner\'s Income & Expense Declaration', page: 3, type: 'declaration' }
              ]
            },
            {
              description: 'Motorcycle (50% community property share)',
              amount: 5855.00,
              status: 'valid',
              calculation: 'Appraised value: $11,710 ÷ 2',
              sources: [
                { document: 'Property Settlement Agreement', page: 6, type: 'declaration' }
              ]
            },
            {
              description: 'Household Items and Furnishings',
              amount: 7500.00,
              status: 'valid',
              sources: [
                { document: 'Agreed List of Personal Property', type: 'exhibit' }
              ]
            }
          ],
          disputed: []
        },
        proposedDistribution: {
          netProceeds: 280355.83,
          petitionerShare: 172947.76,
          respondentShare: 107408.07,
          basis: 'Equal division of net proceeds ($140,177.92 each) minus valid Petitioner claims ($65,316.81) plus Respondent offset for Petitioner\'s exclusive use ($29,250) plus invalid claims adjustment ($77,779.88)',
          sources: [
            { document: 'Final Settlement Statement', page: 1, type: 'settlement_stmt' },
            { document: 'Respondent\'s Responsive Declaration', page: 8, section: 'Proposed Distribution', type: 'declaration' }
          ]
        }
      });

      setLoading(false);
    };

    loadData();
  }, []);

  // Memoize data transformations to prevent unnecessary recalculations
  const continuanceData = useMemo(() => analysisData ? [
    { name: 'Petitioner', value: analysisData.continuances.petitionerRequests, color: '#EF4444' },
    { name: 'Respondent', value: analysisData.continuances.respondentRequests, color: '#8B5CF6' },
    { name: 'Court', value: analysisData.continuances.courtRequests, color: '#3B82F6' }
  ] : [], [analysisData]);

  const communicationData = useMemo(() => analysisData ? [
    { name: 'Petitioner', emails: analysisData.communications.petitionerEmails, responseTime: analysisData.communications.petitionerResponseTime },
    { name: 'Respondent', emails: analysisData.communications.respondentEmails, responseTime: analysisData.communications.respondentResponseTime }
  ] : [], [analysisData]);

  const financialData = useMemo(() => analysisData ? [
    { category: 'Invalid Claims', amount: analysisData.summary.totalInvalidClaims, color: '#EF4444' },
    { category: 'Valid Claims', amount: analysisData.summary.totalValidClaims, color: '#10B981' }
  ] : [], [analysisData]);

  const invalidClaimsBreakdown = useMemo(() => analysisData?.claims.invalid.map(claim => ({
    name: claim.description,
    amount: claim.amount,
    color: '#EF4444'
  })) || [], [analysisData]);

  const validClaimsBreakdown = useMemo(() => analysisData?.claims.valid.map(claim => ({
    name: claim.description,
    amount: claim.amount,
    color: '#10B981'
  })) || [], [analysisData]);

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
    return <PageSkeleton type="analytics" />;
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-2xl">
                <Scale className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <Badge variant="outline" className="text-xs font-bold text-red-700 border-red-400 bg-red-50 px-3 py-1">
                    CRITICAL MATHEMATICAL ERRORS DETECTED
                  </Badge>
                  <Badge variant="outline" className="text-xs font-bold text-blue-700 border-blue-400 bg-blue-50 px-3 py-1">
                    {analysisData?.summary.invalidPercentage}% Invalid Claims
                  </Badge>
                </div>
                <h1 className={`${typography.display.small} text-slate-900 mb-2`}>
                  RFO Responsive Declaration
                </h1>
                <p className={`${typography.body.large} text-slate-600 max-w-4xl`}>
                  Comprehensive forensic analysis of Petitioner's Request for Order with detailed mathematical refutations, source citations, and evidence-based counterproposals
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <div className={`${typography.caption.large} text-slate-500 mb-1`}>Analysis Date</div>
                <div className={`${typography.body.medium} font-semibold text-slate-800`}>
                  {analysisData ? new Date(analysisData.summary.analysisDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-700" />
                  </div>
                  <Badge className="bg-red-600 text-white text-xs">Invalid</Badge>
                </div>
                <div className={`${typography.heading.h2} text-red-900 mb-1`}>
                  ${analysisData?.summary.totalInvalidClaims.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`${typography.caption.large} text-red-700 mb-2`}>
                  Total Invalid Claims
                </div>
                <div className={`${typography.caption.small} text-red-600`}>
                  {analysisData?.summary.invalidPercentage}% of Petitioner's total claims
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <Badge className="bg-green-600 text-white text-xs">Valid</Badge>
                </div>
                <div className={`${typography.heading.h2} text-green-900 mb-1`}>
                  ${analysisData?.summary.totalValidClaims.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`${typography.caption.large} text-green-700 mb-2`}>
                  Valid Petitioner Claims
                </div>
                <div className={`${typography.caption.small} text-green-600`}>
                  Supported by evidence and law
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-200 flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-700" />
                  </div>
                  <Badge className="bg-blue-600 text-white text-xs">Net Position</Badge>
                </div>
                <div className={`${typography.heading.h2} text-blue-900 mb-1`}>
                  ${analysisData?.summary.netRespondentPosition.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`${typography.caption.large} text-blue-700 mb-2`}>
                  Respondent's Net Position
                </div>
                <div className={`${typography.caption.small} text-blue-600`}>
                  After all valid adjustments
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-200 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-purple-700" />
                  </div>
                  <Badge className="bg-purple-600 text-white text-xs">Property</Badge>
                </div>
                <div className={`${typography.heading.h2} text-purple-900 mb-1`}>
                  ${analysisData?.propertyDetails.netProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`${typography.caption.large} text-purple-700 mb-2`}>
                  Net Sale Proceeds
                </div>
                <div className={`${typography.caption.small} text-purple-600`}>
                  From settlement statement
                </div>
              </CardContent>
            </Card>
          </div>
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
                    <Suspense fallback={<ChartSkeleton />}>
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
                    </Suspense>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Financial Claims Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Suspense fallback={<ChartSkeleton />}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financialData}>
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                          <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Suspense>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Mathematical Errors Tab */}
        {activeTab === 'mathematical' && (
          <div className="space-y-6">
            {/* Critical Error Card */}
            <Card className="bg-gradient-to-br from-red-50 via-red-100/50 to-pink-50 border-2 border-red-300 shadow-2xl">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 p-1">
                <div className="bg-white rounded-t-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <AlertTriangle className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-red-600 text-white text-xs font-bold">CRITICAL ERROR</Badge>
                          <Badge variant="outline" className="border-red-400 text-red-700 text-xs">
                            ${analysisData.mathematicalErrors.totalInvalidClaims.toLocaleString()}
                          </Badge>
                        </div>
                        <CardTitle className={`${typography.heading.h2} text-red-900 mb-2`}>
                          {analysisData.mathematicalErrors.coreError}
                        </CardTitle>
                        <p className={`${typography.body.medium} text-red-800`}>
                          {analysisData.mathematicalErrors.detailedExplanation}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Petitioner's Impossible Calculation */}
                  <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-red-200 flex items-center justify-center">
                        <span className="text-red-900 text-lg font-bold">✗</span>
                      </div>
                      <h4 className={`${typography.heading.h5} text-red-900`}>
                        Petitioner's Impossible Calculation
                      </h4>
                    </div>
                    <div className={`${typography.body.small} text-red-800 space-y-2`}>
                      <div className="flex justify-between items-center py-2 border-b border-red-100">
                        <span>1. Net Escrow Proceeds:</span>
                        <span className="font-semibold">${analysisData.propertyDetails.netProceeds.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-red-100">
                        <span>2. "Add Back" Request:</span>
                        <span className="font-semibold text-red-700">+$77,779.88</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-red-300">
                        <span>3. Fictional Total:</span>
                        <span className="font-bold">$358,135.71</span>
                      </div>
                      <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
                        <p className={`${typography.label.medium} text-red-900 flex items-center gap-2`}>
                          <AlertTriangle className="h-4 w-4" />
                          MATHEMATICALLY IMPOSSIBLE
                        </p>
                        <p className={`${typography.caption.medium} text-red-700 mt-1`}>
                          Cannot both deduct AND add back the same amount
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Correct Calculation */}
                  <div className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-700" />
                      </div>
                      <h4 className={`${typography.heading.h5} text-green-900`}>
                        Mathematically Correct Calculation
                      </h4>
                    </div>
                    <div className={`${typography.body.small} text-green-800 space-y-2`}>
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span>1. Gross Sale Price:</span>
                        <span className="font-semibold">${analysisData.propertyDetails.salePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span>2. Less: Mortgage Payoff:</span>
                        <span className="font-semibold">-${analysisData.propertyDetails.mortgagePayoff.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span>3. Less: Closing Costs:</span>
                        <span className="font-semibold">-${analysisData.propertyDetails.closingCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-300">
                        <span className="font-semibold">4. Net Proceeds:</span>
                        <span className="font-bold text-green-700">${analysisData.propertyDetails.netProceeds.toLocaleString()}</span>
                      </div>
                      <div className="bg-green-100 border border-green-300 rounded-lg p-3 mt-3">
                        <p className={`${typography.label.medium} text-green-900 flex items-center gap-2`}>
                          <CheckCircle className="h-4 w-4" />
                          MATHEMATICALLY CORRECT
                        </p>
                        <p className={`${typography.caption.medium} text-green-700 mt-1`}>
                          Verified by settlement statement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <SourcesList sources={analysisData.mathematicalErrors.sources} title="Evidence & Documentation" />
              </CardContent>
            </Card>

            {/* Invalid Claims Breakdown */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <CardTitle className={`${typography.heading.h3} text-slate-900`}>
                        Invalid Claims Breakdown
                      </CardTitle>
                      <p className={`${typography.caption.large} text-slate-600 mt-1`}>
                        Detailed analysis of {analysisData.claims.invalid.length} invalid claims totaling ${analysisData.summary.totalInvalidClaims.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${typography.heading.h2} text-red-600`}>
                      ${analysisData.summary.totalInvalidClaims.toLocaleString()}
                    </div>
                    <div className={`${typography.caption.medium} text-slate-600`}>
                      Total Invalid
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.claims.invalid.map((claim, index) => (
                    <div
                      key={index}
                      className="group border-2 border-red-200 rounded-xl p-5 hover:border-red-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-red-50/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                              <span className={`${typography.caption.small} font-bold text-red-700`}>
                                {index + 1}
                              </span>
                            </div>
                            <h4 className={`${typography.heading.h5} text-slate-900`}>
                              {claim.description}
                            </h4>
                          </div>
                          <p className={`${typography.body.small} text-red-700 mb-3 ml-9`}>
                            <strong>Reason:</strong> {claim.reason}
                          </p>
                          {claim.calculation && (
                            <div className="ml-9 bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
                              <p className={`${typography.caption.large} text-slate-600 mb-1 font-semibold`}>
                                Calculation Breakdown:
                              </p>
                              <p className={`${typography.caption.medium} text-slate-700 font-mono`}>
                                {claim.calculation}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className={`${typography.heading.h3} text-red-600`}>
                            ${claim.amount.toLocaleString()}
                          </div>
                          <Badge className="bg-red-600 text-white mt-1">Invalid</Badge>
                        </div>
                      </div>
                      <SourcesList sources={claim.sources} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Valid Claims for Comparison */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <CardTitle className={`${typography.heading.h3} text-slate-900`}>
                        Valid Claims (For Comparison)
                      </CardTitle>
                      <p className={`${typography.caption.large} text-slate-600 mt-1`}>
                        {analysisData.claims.valid.length} valid claims totaling ${analysisData.summary.totalValidClaims.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${typography.heading.h2} text-green-600`}>
                      ${analysisData.summary.totalValidClaims.toLocaleString()}
                    </div>
                    <div className={`${typography.caption.medium} text-slate-600`}>
                      Total Valid
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisData.claims.valid.map((claim, index) => (
                    <div
                      key={index}
                      className="border-2 border-green-200 rounded-xl p-4 bg-gradient-to-br from-white to-green-50/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className={`${typography.body.medium} font-semibold text-slate-900 mb-1`}>
                            {claim.description}
                          </h5>
                          {claim.calculation && (
                            <p className={`${typography.caption.medium} text-slate-600 font-mono`}>
                              {claim.calculation}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <div className={`${typography.body.large} font-bold text-green-600`}>
                            ${claim.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <SourcesList sources={claim.sources} />
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
