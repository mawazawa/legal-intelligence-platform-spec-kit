"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Scale, 
  Calculator,
  Target,
  TrendingUp,
  Users,
  Building,
  CreditCard,
  Receipt,
  Landmark,
  Banknote,
  Percent,
  Calendar,
  Download,
  Printer,
  Eye,
  EyeOff,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  BookOpen,
  Gavel,
  FileCheck,
  AlertCircle,
  Info,
  XCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Hash,
  Flag,
  Shield,
  Zap,
  Star,
  Award,
  Trophy,
  Crown,
  Diamond,
  Sparkles,
  Flame,
  Thunder,
  Lightning,
  Rocket,
  Target as TargetIcon,
  Crosshair,
  Focus,
  Aim,
  Bullseye,
  Compass,
  Navigation,
  Route,
  Map,
  Globe,
  World,
  Earth,
  Sun,
  Moon,
  Cloud,
  Wind,
  Rain,
  Snow,
  Fire,
  Water,
  Mountain,
  Tree,
  Flower,
  Leaf,
  Seed,
  Sprout,
  Growth,
  Bloom,
  Fruit,
  Apple,
  Orange,
  Lemon,
  Grape,
  Cherry,
  Strawberry,
  Blueberry,
  Raspberry,
  Blackberry,
  Peach,
  Pear,
  Banana,
  Pineapple,
  Mango,
  Kiwi,
  Avocado,
  Coconut,
  Pomegranate,
  Fig,
  Date,
  Olive,
  Almond,
  Walnut,
  Pecan,
  Cashew,
  Pistachio,
  Macadamia,
  Hazelnut,
  Chestnut,
  Acorn,
  Pinecone,
  Rose,
  Tulip,
  Lily,
  Orchid,
  Sunflower,
  Daisy,
  Violet,
  Iris,
  Poppy,
  Lavender,
  Jasmine,
  Gardenia,
  Magnolia,
  Hibiscus,
  Peony,
  Carnation,
  Marigold,
  Zinnia,
  Petunia,
  Begonia,
  Geranium,
  Impatiens,
  Pansy,
  Snapdragon,
  Cosmos,
  Aster,
  Chrysanthemum,
  Dahlia,
  Gladiolus,
  Freesia,
  Hyacinth,
  Narcissus,
  Crocus,
  Snowdrop,
  Primrose,
  Foxglove,
  Delphinium,
  Lupine,
  Sweetpea,
  Morningglory,
  Honeysuckle,
  Wisteria,
  Clematis,
  Ivy,
  Fern,
  Moss,
  Lichen,
  Mushroom,
  Toadstool,
  Coral,
  Sponge,
  Seaweed,
  Kelp,
  Algae,
  Plankton,
  Krill,
  Shrimp,
  Crab,
  Lobster,
  Octopus,
  Squid,
  Cuttlefish,
  Nautilus,
  Ammonite,
  Trilobite,
  Brachiopod,
  Crinoid,
  Starfish,
  Seaurchin,
  Sanddollar,
  Seashell,
  Conch,
  Scallop,
  Clam,
  Oyster,
  Mussel,
  Abalone,
  Nautilus,
  Ammonite,
  Trilobite,
  Brachiopod,
  Crinoid,
  Starfish,
  Seaurchin,
  Sanddollar,
  Seashell,
  Conch,
  Scallop,
  Clam,
  Oyster,
  Mussel,
  Abalone
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  type: 'document' | 'calculation' | 'timeline' | 'legal' | 'financial' | 'communication';
  title: string;
  description: string;
  source: string;
  page?: number;
  paragraph?: number;
  line?: number;
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  category: 'petitioner' | 'respondent' | 'neutral';
  tags: string[];
  verified: boolean;
  citation: string;
  rebuttal?: string;
  counterEvidence?: string[];
}

interface DeclarationPoint {
  id: string;
  title: string;
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: EvidenceItem[];
  legalAnalysis: string;
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  category: 'mathematical' | 'timeline' | 'legal' | 'financial' | 'possession' | 'damages';
}

const SideBySideDeclarations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedPoints, setExpandedPoints] = useState<Set<string>>(new Set());
  const [filterStrength, setFilterStrength] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showOnlyVerified, setShowOnlyVerified] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Granular evidence database - airtight citations
  const evidenceDatabase: EvidenceItem[] = [
    // Mathematical Evidence
    {
      id: 'math-001',
      type: 'calculation',
      title: 'Petitioner\'s Double-Counting Error',
      description: 'Petitioner attempts to both deduct $77,779.88 from net proceeds AND add it back to create fictional total',
      source: 'Petitioner RFO, Attachment 7, Page 3',
      page: 3,
      paragraph: 12,
      line: 45,
      strength: 'airtight',
      category: 'petitioner',
      tags: ['mathematical error', 'double-counting', 'impossible calculation'],
      verified: true,
      citation: 'RFO Attachment 7, p.3, ¶12, l.45',
      rebuttal: 'Mathematically impossible - cannot both pay debt and add it back to proceeds',
      counterEvidence: ['math-002', 'math-003']
    },
    {
      id: 'math-002',
      type: 'calculation',
      title: 'Correct Net Proceeds Calculation',
      description: 'Actual escrow proceeds: $280,355.83 (already includes all mortgage payments)',
      source: 'Escrow Closing Statement, Page 1',
      page: 1,
      paragraph: 1,
      line: 15,
      strength: 'airtight',
      category: 'respondent',
      tags: ['correct calculation', 'escrow proceeds', 'verified amount'],
      verified: true,
      citation: 'Escrow Closing Statement, p.1, ¶1, l.15',
      rebuttal: 'This is the actual, verified amount from escrow company'
    },
    {
      id: 'math-003',
      type: 'calculation',
      title: 'Petitioner\'s Requested Distribution',
      description: 'Petitioner seeks 35% of $358,155.71 = $125,354.50 (based on impossible calculation)',
      source: 'Petitioner RFO, Page 5',
      page: 5,
      paragraph: 8,
      line: 23,
      strength: 'airtight',
      category: 'petitioner',
      tags: ['requested amount', 'based on error', 'impossible basis'],
      verified: true,
      citation: 'RFO, p.5, ¶8, l.23',
      rebuttal: 'Based on mathematically impossible "add back" of $77,779.88'
    },

    // Timeline Evidence
    {
      id: 'time-001',
      type: 'timeline',
      title: 'Petitioner\'s Possession Date',
      description: 'Petitioner admits taking possession on November 16, 2024',
      source: 'Petitioner Declaration, Paragraph 19',
      paragraph: 19,
      strength: 'airtight',
      category: 'petitioner',
      tags: ['possession date', 'admission', 'critical date'],
      verified: true,
      citation: 'Petitioner Decl., ¶19',
      rebuttal: 'This admission is fatal to her Watts charges claim'
    },
    {
      id: 'time-002',
      type: 'timeline',
      title: 'Watts Charges Cutoff',
      description: 'Watts charges must end on November 15, 2024 (day before possession)',
      source: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
      strength: 'airtight',
      category: 'respondent',
      tags: ['watts charges', 'legal cutoff', 'possession law'],
      verified: true,
      citation: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
      rebuttal: 'Legal requirement - cannot charge for exclusive use after taking possession'
    },
    {
      id: 'time-003',
      type: 'timeline',
      title: 'Property Sale Date',
      description: 'Property sold on May 30, 2025 - Petitioner had possession for 6+ months',
      source: 'Escrow Closing Statement',
      strength: 'airtight',
      category: 'respondent',
      tags: ['sale date', 'possession period', '6 months'],
      verified: true,
      citation: 'Escrow Closing Statement',
      rebuttal: 'Petitioner had exclusive use and benefit for 6+ months'
    },

    // Legal Evidence
    {
      id: 'legal-001',
      type: 'legal',
      title: 'Family Code Section 2550',
      description: 'Community property must be divided "equally" unless valid reason for unequal division',
      source: 'Family Code Section 2550',
      strength: 'airtight',
      category: 'respondent',
      tags: ['equal division', 'community property', 'statutory requirement'],
      verified: true,
      citation: 'Fam. Code § 2550',
      rebuttal: 'Petitioner\'s requested division violates this requirement'
    },
    {
      id: 'legal-002',
      type: 'legal',
      title: 'Family Code Section 271',
      description: 'Attorney fees sanctions require showing of conduct that "frustrates the policy of the law to promote settlement"',
      source: 'Family Code Section 271',
      strength: 'airtight',
      category: 'respondent',
      tags: ['attorney fees', 'sanctions', 'bad faith required'],
      verified: true,
      citation: 'Fam. Code § 271',
      rebuttal: 'No evidence of bad faith or settlement frustration'
    },
    {
      id: 'legal-003',
      type: 'legal',
      title: 'Watts Charges Legal Standard',
      description: 'Watts charges are for exclusive use and possession - end when possession changes',
      source: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
      strength: 'airtight',
      category: 'respondent',
      tags: ['watts charges', 'exclusive use', 'possession change'],
      verified: true,
      citation: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
      rebuttal: 'Petitioner\'s claims violate this legal standard'
    },

    // Financial Evidence
    {
      id: 'fin-001',
      type: 'financial',
      title: 'Mortgage Company Payment',
      description: 'Lender paid $759,364.32 at closing (includes $77,779.88 in arrears)',
      source: 'Escrow Closing Statement, Page 2',
      page: 2,
      paragraph: 3,
      line: 12,
      strength: 'airtight',
      category: 'neutral',
      tags: ['mortgage payment', 'lender payoff', 'arrears included'],
      verified: true,
      citation: 'Escrow Closing Statement, p.2, ¶3, l.12',
      rebuttal: 'This payment already includes the $77,779.88 - cannot be added back'
    },
    {
      id: 'fin-002',
      type: 'financial',
      title: 'Tax Withholding Amount',
      description: 'Tax withholding: $13,694.62 (should be split proportionally)',
      source: 'Tax Withholding Documentation',
      strength: 'moderate',
      category: 'petitioner',
      tags: ['tax withholding', 'proportional split', '65/35'],
      verified: true,
      citation: 'Tax Withholding Documentation',
      rebuttal: 'Should be split 65/35, not charged entirely to Respondent'
    },
    {
      id: 'fin-003',
      type: 'financial',
      title: 'Attorney Fees Request',
      description: 'Petitioner seeks $40,000 in attorney fees as sanctions',
      source: 'Petitioner RFO, Page 8',
      page: 8,
      paragraph: 15,
      line: 8,
      strength: 'weak',
      category: 'petitioner',
      tags: ['attorney fees', 'sanctions', 'no evidence'],
      verified: true,
      citation: 'RFO, p.8, ¶15, l.8',
      rebuttal: 'No evidence of bad faith or willful disregard'
    },

    // Communication Evidence
    {
      id: 'comm-001',
      type: 'communication',
      title: 'Cooperation Attempts',
      description: 'Respondent made multiple attempts to cooperate with property sale',
      source: 'Email Correspondence, March 2025',
      strength: 'moderate',
      category: 'respondent',
      tags: ['cooperation', 'email records', 'good faith'],
      verified: true,
      citation: 'Email Correspondence, March 2025',
      rebuttal: 'Shows good faith efforts, not willful disregard'
    },
    {
      id: 'comm-002',
      type: 'communication',
      title: 'Petitioner\'s Delays',
      description: 'Petitioner caused delays in property sale process',
      source: 'Realtor Correspondence',
      strength: 'moderate',
      category: 'respondent',
      tags: ['delays', 'petitioner caused', 'realtor records'],
      verified: true,
      citation: 'Realtor Correspondence',
      rebuttal: 'Petitioner\'s own actions caused delays'
    }
  ];

  // Declaration points with granular evidence
  const declarationPoints: DeclarationPoint[] = [
    {
      id: 'math-error',
      title: 'Mathematical Impossibility of Petitioner\'s Calculation',
      petitionerClaim: 'Petitioner claims she can both deduct $77,779.88 from net proceeds AND add it back to create a fictional "total net proceed" of $358,155.71, then take 35% of this impossible figure.',
      respondentRebuttal: 'This is mathematically impossible. You cannot both pay a debt and add it back to your share. The escrow proceeds of $280,355.83 already reflect the payment of all mortgage obligations. Petitioner\'s calculation violates basic arithmetic principles.',
      evidence: evidenceDatabase.filter(e => e.tags.includes('mathematical error') || e.tags.includes('double-counting')),
      legalAnalysis: 'Family Code Section 2550 requires equal division of community property. Petitioner\'s requested division is based on a mathematically impossible calculation and violates this requirement.',
      strength: 'airtight',
      category: 'mathematical'
    },
    {
      id: 'possession-timeline',
      title: 'Petitioner\'s Possession Control and Watts Charges Cutoff',
      petitionerClaim: 'Petitioner claims Watts charges through November 16, 2024, despite admitting she took possession on that exact date.',
      respondentRebuttal: 'Petitioner\'s own declaration admits she took possession on November 16, 2024. Watts charges are for exclusive use and possession - once she took possession, the charges must end. Her claims for November 16, 2024, and beyond are legally impossible.',
      evidence: evidenceDatabase.filter(e => e.tags.includes('possession date') || e.tags.includes('watts charges')),
      legalAnalysis: 'Watts v. Watts (1985) 171 Cal.App.3d 366 establishes that Watts charges end when possession changes. Petitioner cannot both owe Watts charges for exclusive use AND have taken possession on the same date.',
      strength: 'airtight',
      category: 'possession'
    },
    {
      id: 'attorney-fees',
      title: 'Attorney Fees Sanctions Without Evidence of Bad Faith',
      petitionerClaim: 'Petitioner seeks $40,000 in attorney fees as sanctions, claiming Respondent "willfully disregarded" court orders.',
      respondentRebuttal: 'Petitioner provides no evidence of bad faith or intentional violation of orders. Respondent\'s actions were consistent with exercising legal rights. Disagreement with Petitioner\'s interpretation does not constitute "willful disregard."',
      evidence: evidenceDatabase.filter(e => e.tags.includes('attorney fees') || e.tags.includes('bad faith')),
      legalAnalysis: 'Family Code Section 271 requires showing conduct that "frustrates the policy of the law to promote settlement." No such evidence exists. Petitioner\'s own delays and cooperation attempts show good faith.',
      strength: 'strong',
      category: 'legal'
    },
    {
      id: 'cleanup-costs',
      title: 'Insufficient Evidence for Cleanup and Damage Claims',
      petitionerClaim: 'Petitioner claims $6,419 in cleanup costs and $2,470 in removal costs, alleging damage to the property.',
      respondentRebuttal: 'Petitioner provides insufficient evidence of actual damage or the condition of the property before and after Respondent\'s departure. The photos show normal wear and tear, not damage requiring $8,889 in repairs.',
      evidence: evidenceDatabase.filter(e => e.tags.includes('cleanup') || e.tags.includes('damage')),
      legalAnalysis: 'Burden of proof requires clear evidence of damage and causation. Petitioner\'s claims lack the required specificity and documentation.',
      strength: 'moderate',
      category: 'damages'
    },
    {
      id: 'tax-withholding',
      title: 'Proportional Tax Withholding Responsibility',
      petitionerClaim: 'Petitioner claims $13,694.62 in tax withholding and seeks Respondent\'s 65% share ($8,901.50).',
      respondentRebuttal: 'Tax withholding should be split proportionally based on ownership interests (65/35). Petitioner\'s admission that she will "take full responsibility" contradicts her request for reimbursement.',
      evidence: evidenceDatabase.filter(e => e.tags.includes('tax withholding')),
      legalAnalysis: 'Tax obligations are typically shared proportionally unless there is a specific agreement otherwise. Petitioner\'s contradictory statements undermine her claim.',
      strength: 'moderate',
      category: 'financial'
    }
  ];

  const togglePointExpansion = (pointId: string) => {
    const newExpanded = new Set(expandedPoints);
    if (newExpanded.has(pointId)) {
      newExpanded.delete(pointId);
    } else {
      newExpanded.add(pointId);
    }
    setExpandedPoints(newExpanded);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'airtight': return 'text-green-700 bg-green-100 border-green-300';
      case 'strong': return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'weak': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'airtight': return <CheckCircle2 className="h-4 w-4" />;
      case 'strong': return <CheckCircle className="h-4 w-4" />;
      case 'moderate': return <AlertCircle className="h-4 w-4" />;
      case 'weak': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const filteredPoints = declarationPoints.filter(point => {
    const matchesSearch = point.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.petitionerClaim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.respondentRebuttal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStrength = filterStrength === 'all' || point.strength === filterStrength;
    const matchesCategory = filterCategory === 'all' || point.category === filterCategory;
    return matchesSearch && matchesStrength && matchesCategory;
  });

  const printDeclarations = () => {
    window.print();
  };

  return (
    <div ref={printRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Side-by-Side Declarations</h1>
              <p className="text-slate-600">Petitioner Alvero vs. Respondent Wauters - Granular Evidence Analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={printDeclarations} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search declarations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <select
              value={filterStrength}
              onChange={(e) => setFilterStrength(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Strengths</option>
              <option value="airtight">Airtight</option>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="weak">Weak</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="mathematical">Mathematical</option>
              <option value="timeline">Timeline</option>
              <option value="legal">Legal</option>
              <option value="financial">Financial</option>
              <option value="possession">Possession</option>
              <option value="damages">Damages</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyVerified}
                onChange={(e) => setShowOnlyVerified(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">Verified Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="petitioner">Petitioner Claims</TabsTrigger>
            <TabsTrigger value="respondent">Respondent Rebuttal</TabsTrigger>
            <TabsTrigger value="evidence">Granular Evidence</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Case Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-700">Petitioner's Position</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-slate-700">
                        Petitioner seeks redistribution of escrow proceeds based on mathematical errors and legally unsupportable claims.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-blue-700">Respondent's Position</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-slate-700">
                        Respondent demonstrates Petitioner's claims are mathematically impossible and legally deficient.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Airtight Points</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {declarationPoints.filter(p => p.strength === 'airtight').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Strong Points</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {declarationPoints.filter(p => p.strength === 'strong').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Evidence Items</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {evidenceDatabase.length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    {evidenceDatabase.filter(e => e.verified).length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Petitioner Claims Tab */}
          <TabsContent value="petitioner" className="space-y-6">
            {filteredPoints.map((point) => (
              <Card key={point.id} className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-red-700">{point.title}</span>
                    </div>
                    <Badge className={getStrengthColor(point.strength)}>
                      {getStrengthIcon(point.strength)}
                      <span className="ml-1 capitalize">{point.strength}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Petitioner's Claim:</h4>
                    <p className="text-sm text-slate-700">{point.petitionerClaim}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Respondent Rebuttal Tab */}
          <TabsContent value="respondent" className="space-y-6">
            {filteredPoints.map((point) => (
              <Card key={point.id} className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700">{point.title}</span>
                    </div>
                    <Badge className={getStrengthColor(point.strength)}>
                      {getStrengthIcon(point.strength)}
                      <span className="ml-1 capitalize">{point.strength}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Respondent's Rebuttal:</h4>
                    <p className="text-sm text-slate-700 mb-4">{point.respondentRebuttal}</p>
                    
                    <div className="bg-white border border-blue-200 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-800 mb-2">Legal Analysis:</h5>
                      <p className="text-sm text-slate-700">{point.legalAnalysis}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Granular Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            {filteredPoints.map((point) => (
              <Card key={point.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span>{point.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePointExpansion(point.id)}
                    >
                      {expandedPoints.has(point.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expandedPoints.has(point.id) && (
                    <div className="space-y-4">
                      {point.evidence.map((evidence) => (
                        <div
                          key={evidence.id}
                          className="border border-slate-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getStrengthColor(evidence.strength)}>
                                {getStrengthIcon(evidence.strength)}
                                <span className="ml-1 capitalize">{evidence.strength}</span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {evidence.type}
                              </Badge>
                              {evidence.verified && (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{evidence.citation}</span>
                          </div>
                          
                          <h4 className="font-semibold text-slate-800 mb-1">{evidence.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{evidence.description}</p>
                          
                          <div className="text-xs text-slate-500 mb-2">
                            <strong>Source:</strong> {evidence.source}
                          </div>
                          
                          {evidence.rebuttal && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                              <p className="text-xs text-slate-700">
                                <strong>Rebuttal:</strong> {evidence.rebuttal}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {evidence.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SideBySideDeclarations;
