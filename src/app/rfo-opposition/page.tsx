"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FileText,
  CheckCircle2,
  Circle,
  Scale as ScaleIcon,
  Calendar,
  AlertTriangle,
  Clock,
  Upload,
  Download,
  Info,
  HelpCircle,
  ChevronRight,
  FileCheck,
  DollarSign,
  Users,
  Home,
  Baby,
  Briefcase,
  ArrowRight,
  AlertCircle,
  CheckSquare,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { RFOChecklistItem as ChecklistItem, RFOType } from '@/types/checklist';

// RFO Types Configuration
const RFO_TYPES: RFOType[] = [
  {
    id: 'child-support',
    name: 'Child Support',
    icon: <Baby className="h-6 w-6" />,
    description: 'Response to requests about child support payments',
    commonIn: 'Divorce, separation, or paternity cases',
    requiredForms: ['FL-320', 'FL-150']
  },
  {
    id: 'spousal-support',
    name: 'Spousal Support',
    icon: <Users className="h-6 w-6" />,
    description: 'Response to requests about spousal/partner support',
    commonIn: 'Divorce or domestic partnership dissolution',
    requiredForms: ['FL-320', 'FL-150']
  },
  {
    id: 'property-division',
    name: 'Property Division',
    icon: <Home className="h-6 w-6" />,
    description: 'Response to requests about dividing property or assets',
    commonIn: 'Divorce, legal separation',
    requiredForms: ['FL-320', 'FL-150', 'Detailed Financials']
  },
  {
    id: 'custody-visitation',
    name: 'Child Custody/Visitation',
    icon: <Baby className="h-6 w-6" />,
    description: 'Response to requests about custody or parenting time',
    commonIn: 'Divorce, separation, paternity, modification cases',
    requiredForms: ['FL-320', 'FL-105', 'FL-311']
  },
  {
    id: 'attorney-fees',
    name: 'Attorney Fees',
    icon: <Briefcase className="h-6 w-6" />,
    description: 'Response to requests for attorney fee payments',
    commonIn: 'Any family law case',
    requiredForms: ['FL-320', 'FL-150', 'FL-319']
  }
];

// Deadline Calculator Utility
const calculateCourtDays = (hearingDate: Date, daysNeeded: number): Date => {
  const result = new Date(hearingDate);
  let daysSubtracted = 0;

  while (daysSubtracted < daysNeeded) {
    result.setDate(result.getDate() - 1);
    const dayOfWeek = result.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysSubtracted++;
    }
  }

  return result;
};

const RFOOppositionPage: React.FC = () => {
  const [selectedRFOType, setSelectedRFOType] = useState<string | null>(null);
  const [hearingDate, setHearingDate] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Calculate filing deadline (9 court days before hearing)
  const filingDeadline = useMemo(() => {
    if (!hearingDate) return null;
    const hearing = new Date(hearingDate);
    return calculateCourtDays(hearing, 9);
  }, [hearingDate]);

  // Days until deadline
  const daysUntilDeadline = useMemo(() => {
    if (!filingDeadline) return null;
    const today = new Date();
    const diffTime = filingDeadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [filingDeadline]);

  // Initialize checklist based on RFO type
  useEffect(() => {
    if (!selectedRFOType) return;

    const baseItems: ChecklistItem[] = [
      {
        id: 'fl-320',
        category: 'Required Forms',
        title: 'FL-320 Responsive Declaration',
        description: 'Main form to respond to the Request for Order',
        plainEnglish: 'This is your main response form where you tell the court your side of the story. Think of it as your "answer" to what the other party asked for.',
        required: true,
        status: 'not-started',
        priority: 'critical',
        estimatedMinutes: 30,
        documentUrl: 'https://courts.ca.gov/documents/fl320.pdf',
        helpUrl: 'https://courts.ca.gov/documents/fl320info.pdf'
      },
      {
        id: 'proof-of-service',
        category: 'Required Forms',
        title: 'Proof of Service',
        description: 'Documentation showing you served the other party',
        plainEnglish: 'Proof that you sent copies of your paperwork to the other party. Someone over 18 (not you!) must deliver or mail the documents, then fill out this form.',
        required: true,
        status: 'not-started',
        priority: 'critical',
        estimatedMinutes: 10
      }
    ];

    // Add conditional forms based on RFO type
    if (['child-support', 'spousal-support', 'property-division', 'attorney-fees'].includes(selectedRFOType)) {
      baseItems.push({
        id: 'fl-150',
        category: 'Financial Forms',
        title: 'FL-150 Income and Expense Declaration',
        description: 'Complete financial disclosure form',
        plainEnglish: 'Your complete financial picture: what you earn, what you spend, what you own, and what you owe. Required for any money-related requests.',
        required: true,
        status: 'not-started',
        priority: 'critical',
        estimatedMinutes: 45,
        documentUrl: 'https://courts.ca.gov/documents/fl150.pdf'
      });

      baseItems.push({
        id: 'pay-stubs',
        category: 'Supporting Documents',
        title: 'Recent Pay Stubs (2 months)',
        description: 'Last 2 months of pay stubs or income proof',
        plainEnglish: 'Your most recent pay stubs showing what you actually earn. If self-employed, bring profit/loss statements or Schedule C from your tax return.',
        required: true,
        conditionalOn: ['fl-150'],
        status: 'not-started',
        priority: 'high',
        estimatedMinutes: 5
      });

      baseItems.push({
        id: 'tax-returns',
        category: 'Supporting Documents',
        title: 'Most Recent Tax Return',
        description: 'Your last filed federal tax return',
        plainEnglish: 'Bring your complete tax return to the hearing (you don\'t file it, just have it ready). Black out your social security number before bringing copies.',
        required: true,
        conditionalOn: ['fl-150'],
        status: 'not-started',
        priority: 'high',
        estimatedMinutes: 5
      });
    }

    if (selectedRFOType === 'custody-visitation') {
      baseItems.push({
        id: 'fl-105',
        category: 'Custody Forms',
        title: 'FL-105 UCCJEA Declaration',
        description: 'Declaration about child custody jurisdiction',
        plainEnglish: 'A form telling the court where your child has lived for the past 5 years. This helps the court decide if California is the right place to make custody decisions.',
        required: true,
        status: 'not-started',
        priority: 'critical',
        estimatedMinutes: 20,
        documentUrl: 'https://courts.ca.gov/documents/fl105.pdf'
      });

      baseItems.push({
        id: 'fl-311',
        category: 'Custody Forms',
        title: 'FL-311 Child Custody and Visitation Application',
        description: 'Details about your custody/visitation request',
        plainEnglish: 'Describe what custody arrangement you want: where the child lives, when they visit the other parent, holidays, etc. Be specific about your ideal schedule.',
        required: false,
        status: 'not-started',
        priority: 'high',
        estimatedMinutes: 30,
        documentUrl: 'https://courts.ca.gov/documents/fl311.pdf'
      });
    }

    if (selectedRFOType === 'attorney-fees') {
      baseItems.push({
        id: 'fl-319',
        category: 'Fee Forms',
        title: 'FL-319 Request for Attorney Fees Attachment',
        description: 'Breakdown of attorney fees requested',
        plainEnglish: 'If asking for the other party to pay your lawyer, explain why you need help with fees and list all costs (hourly rate, hours worked, court filing fees, etc.).',
        required: true,
        status: 'not-started',
        priority: 'high',
        estimatedMinutes: 25,
        documentUrl: 'https://courts.ca.gov/documents/fl319.pdf'
      });
    }

    if (selectedRFOType === 'property-division') {
      baseItems.push({
        id: 'property-declaration',
        category: 'Property Forms',
        title: 'Property Declaration and Financial Analysis',
        description: 'Detailed breakdown of property division calculations',
        plainEnglish: 'For complex property issues (like dividing home sale proceeds), attach detailed calculations showing how you arrived at your numbers. Include source documents.',
        required: true,
        status: 'not-started',
        priority: 'critical',
        estimatedMinutes: 60
      });

      baseItems.push({
        id: 'financial-exhibit',
        category: 'Exhibits',
        title: 'Exhibit: Financial Computation',
        description: 'Your calculation exhibit from the Financial Distribution page',
        plainEnglish: 'Use the Financial Distribution Calculator tool to generate a court-ready exhibit showing exactly how property should be divided. This becomes Exhibit A or B.',
        required: true,
        status: 'not-started',
        priority: 'critical',
        estimatedMinutes: 15
      });
    }

    // Common optional items
    baseItems.push({
      id: 'memo-points-auth',
      category: 'Legal Arguments',
      title: 'Memorandum of Points and Authorities',
      description: 'Legal brief with case law and statutes',
      plainEnglish: 'Optional but powerful: a legal brief citing laws and court cases that support your position. Usually prepared by an attorney, but you can do it yourself with research.',
      required: false,
      status: 'not-started',
      priority: 'medium',
      estimatedMinutes: 120
    });

    baseItems.push({
      id: 'supporting-declaration',
      category: 'Declarations',
      title: 'Supporting Declarations',
      description: 'Statements from witnesses or experts',
      plainEnglish: 'Written statements from people who can support your case (family, friends, doctors, therapists). Must be signed under penalty of perjury.',
      required: false,
      status: 'not-started',
      priority: 'low',
      estimatedMinutes: 30
    });

    setChecklistItems(baseItems);
  }, [selectedRFOType]);

  // Progress calculations
  const completedCount = checklistItems.filter(item => item.status === 'completed').length;
  const totalRequired = checklistItems.filter(item => item.required).length;
  const requiredCompleted = checklistItems.filter(item => item.required && item.status === 'completed').length;
  const progressPercentage = totalRequired > 0 ? (requiredCompleted / totalRequired) * 100 : 0;

  const toggleItemStatus = (itemId: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === itemId) {
        let newStatus: ChecklistItem['status'];
        if (item.status === 'not-started') newStatus = 'in-progress';
        else if (item.status === 'in-progress') newStatus = 'completed';
        else newStatus = 'not-started';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-3 flex items-center justify-center">
              <ScaleIcon className="h-10 w-10 mr-3 text-blue-600" />
              RFO Opposition Filing Guide
            </h1>
            <p className="text-xl text-slate-600 mb-2">File Your FL-320 Response in Plain English</p>
            <p className="text-sm text-slate-500">San Francisco Superior Court Family Law | 2025 Rules</p>
          </div>

          {/* Step 1: Select RFO Type */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-0 bg-white mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                  What is the Other Party Asking For?
                </CardTitle>
                <p className="text-slate-600 text-sm mt-2">Select the main topic of the Request for Order (RFO) you received</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {RFO_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedRFOType(type.id)}
                      className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                        selectedRFOType === type.id
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start mb-3">
                        <div className={`p-3 rounded-lg ${selectedRFOType === type.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          {type.icon}
                        </div>
                        {selectedRFOType === type.id && (
                          <CheckCircle2 className="h-6 w-6 text-blue-600 ml-auto" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">{type.name}</h3>
                      <p className="text-sm text-slate-600 mb-3">{type.description}</p>
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold">Common in:</span> {type.commonIn}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedRFOType && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    >
                      Continue to Deadline Calculator
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Deadline Calculator */}
          {currentStep === 2 && (
            <>
              <Card className="shadow-xl border-0 bg-white mb-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                    When is Your Hearing?
                  </CardTitle>
                  <p className="text-slate-600 text-sm mt-2">We'll calculate your filing deadline (9 court days before hearing)</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-md">
                    <Label htmlFor="hearing-date" className="text-sm font-semibold mb-2 block">Hearing Date</Label>
                    <input
                      id="hearing-date"
                      type="date"
                      value={hearingDate}
                      onChange={(e) => setHearingDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {filingDeadline && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`p-4 rounded-lg ${daysUntilDeadline! < 3 ? 'bg-red-100 border-2 border-red-300' : 'bg-green-100 border-2 border-green-300'}`}>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 mr-2 text-slate-700" />
                          <span className="text-sm font-semibold text-slate-700">Filing Deadline</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                          {filingDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg ${daysUntilDeadline! < 3 ? 'bg-red-100 border-2 border-red-300' : 'bg-blue-100 border-2 border-blue-300'}`}>
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 mr-2 text-slate-700" />
                          <span className="text-sm font-semibold text-slate-700">Days Remaining</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                          {daysUntilDeadline} days
                        </div>
                        {daysUntilDeadline! < 3 && (
                          <Badge className="bg-red-600 text-white mt-2">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 rounded-lg bg-purple-100 border-2 border-purple-300">
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 mr-2 text-slate-700" />
                          <span className="text-sm font-semibold text-slate-700">Estimated Time</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                          {Math.ceil(checklistItems.filter(i => i.required).reduce((sum, i) => sum + i.estimatedMinutes, 0) / 60)} hours
                        </div>
                      </div>
                    </div>
                  )}

                  {hearingDate && (
                    <div className="mt-6 flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                      >
                        View Your Checklist
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 3: Interactive Checklist */}
          {currentStep === 3 && (
            <>
              {/* Progress Dashboard */}
              <Card className="shadow-xl border-0 bg-white mb-6">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                    Your Filing Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Required Items Progress</span>
                      <span className="text-sm font-bold text-slate-900">{requiredCompleted}/{totalRequired} Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        {progressPercentage > 10 && (
                          <span className="text-white text-xs font-bold">{progressPercentage.toFixed(0)}%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Not Started</span>
                        <Circle className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {checklistItems.filter(i => i.status === 'not-started').length}
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-yellow-700">In Progress</span>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-900">
                        {checklistItems.filter(i => i.status === 'in-progress').length}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-700">Completed</span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {completedCount}
                      </div>
                    </div>
                  </div>

                  {/* Deadline Warning */}
                  {daysUntilDeadline !== null && daysUntilDeadline < 5 && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 flex items-start">
                      <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-900 mb-1">Urgent: Deadline Approaching!</h4>
                        <p className="text-sm text-red-800">
                          You have only {daysUntilDeadline} days until your filing deadline ({filingDeadline?.toLocaleDateString()}).
                          Focus on required items first. Consider getting professional help if you're running short on time.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Checklist by Category */}
              <Tabs defaultValue="required" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="required" className="text-sm">
                    Required ({checklistItems.filter(i => i.required).length})
                  </TabsTrigger>
                  <TabsTrigger value="optional" className="text-sm">
                    Optional ({checklistItems.filter(i => !i.required).length})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="text-sm">
                    All Items ({checklistItems.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="required">
                  {Object.entries(
                    checklistItems
                      .filter(item => item.required)
                      .reduce((acc, item) => {
                        if (!acc[item.category]) acc[item.category] = [];
                        acc[item.category].push(item);
                        return acc;
                      }, {} as Record<string, ChecklistItem[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                        {category}
                      </h3>
                      <div className="space-y-4">
                        {items.map(item => (
                          <Card
                            key={item.id}
                            className={`border-l-4 ${
                              item.status === 'completed' ? 'border-l-green-500 bg-green-50' :
                              item.status === 'in-progress' ? 'border-l-yellow-500 bg-yellow-50' :
                              'border-l-red-500 bg-white'
                            } shadow-md hover:shadow-lg transition-all`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start">
                                <button
                                  onClick={() => toggleItemStatus(item.id)}
                                  className="mt-1 mr-4 hover:scale-110 transition-transform"
                                >
                                  {getStatusIcon(item.status)}
                                </button>

                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                                        <Badge className={getPriorityColor(item.priority)}>
                                          {item.priority.toUpperCase()}
                                        </Badge>
                                        {item.required && (
                                          <Badge className="bg-red-100 text-red-800 border-red-300">REQUIRED</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="text-xs text-slate-500 mb-1">Est. Time</div>
                                      <div className="text-sm font-semibold text-slate-700">{item.estimatedMinutes} min</div>
                                    </div>
                                  </div>

                                  {/* Plain English Explanation */}
                                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-3">
                                    <div className="flex items-start">
                                      <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <h5 className="text-sm font-semibold text-blue-900 mb-1">Plain English:</h5>
                                        <p className="text-sm text-blue-800">{item.plainEnglish}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 flex-wrap">
                                    {item.documentUrl && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(item.documentUrl, '_blank')}
                                        className="text-blue-600 hover:text-blue-700"
                                      >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download Form
                                      </Button>
                                    )}
                                    {item.helpUrl && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(item.helpUrl, '_blank')}
                                        className="text-purple-600 hover:text-purple-700"
                                      >
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        Help Guide
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Upload className="h-4 w-4 mr-1" />
                                      Upload Document
                                    </Button>

                                    {/* Special button for property division calculation */}
                                    {item.id === 'financial-exhibit' && (
                                      <Link href="/final-distribution" target="_blank">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-orange-600 hover:text-orange-700"
                                        >
                                          <FileText className="h-4 w-4 mr-1" />
                                          Generate Calculation
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="optional">
                  {checklistItems.filter(item => !item.required).map(item => (
                    <Card
                      key={item.id}
                      className="border-l-4 border-l-gray-300 bg-white shadow-md hover:shadow-lg transition-all mb-4"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <button
                            onClick={() => toggleItemStatus(item.id)}
                            className="mt-1 mr-4 hover:scale-110 transition-transform"
                          >
                            {getStatusIcon(item.status)}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                              <Badge className="bg-gray-100 text-gray-700 border-gray-300">OPTIONAL</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{item.description}</p>

                            {/* Plain English */}
                            <div className="bg-gray-50 border-l-4 border-gray-300 p-3 rounded mb-3">
                              <div className="flex items-start">
                                <Info className="h-4 w-4 text-gray-600 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                  <h5 className="text-sm font-semibold text-gray-800 mb-1">Plain English:</h5>
                                  <p className="text-sm text-gray-700">{item.plainEnglish}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="all">
                  <div className="space-y-4">
                    {checklistItems.map(item => (
                      <Card
                        key={item.id}
                        className={`border-l-4 ${
                          item.status === 'completed' ? 'border-l-green-500 bg-green-50' :
                          item.status === 'in-progress' ? 'border-l-yellow-500 bg-yellow-50' :
                          'border-l-gray-300 bg-white'
                        } shadow-md hover:shadow-lg transition-all`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <button
                              onClick={() => toggleItemStatus(item.id)}
                              className="mt-1 mr-4 hover:scale-110 transition-transform"
                            >
                              {getStatusIcon(item.status)}
                            </button>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                                <Badge className={getPriorityColor(item.priority)}>
                                  {item.priority.toUpperCase()}
                                </Badge>
                                {item.required ? (
                                  <Badge className="bg-red-100 text-red-800 border-red-300">REQUIRED</Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-700 border-gray-300">OPTIONAL</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Quick Links */}
              <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-purple-100 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-900">Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/fl320-checklist" target="_blank">
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                        <FileCheck className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Detailed FL-320 Checklist</div>
                          <div className="text-xs text-slate-600">Complete filing packet checklist</div>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/final-distribution" target="_blank">
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                        <DollarSign className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Financial Calculator</div>
                          <div className="text-xs text-slate-600">Property division calculations</div>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/documents" target="_blank">
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                        <FileText className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Document Library</div>
                          <div className="text-xs text-slate-600">All case documents and evidence</div>
                        </div>
                      </Button>
                    </Link>

                    <a href="https://sf.courts.ca.gov/divisions/unified-family-court" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                        <ScaleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">SF Superior Court</div>
                          <div className="text-xs text-slate-600">Official family court website</div>
                        </div>
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Back to Deadline
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    Print Checklist
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={requiredCompleted < totalRequired}
                  >
                    {requiredCompleted < totalRequired ? (
                      <>
                        <XCircle className="h-5 w-5 mr-2" />
                        Complete Required Items First
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-5 w-5 mr-2" />
                        Ready to File!
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RFOOppositionPage;
