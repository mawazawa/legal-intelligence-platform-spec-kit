'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calculator, 
  FileText, 
  Scale, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  EyeOff,
  PenLine,
  Trash2,
  Calendar,
  DollarSign,
  Mail,
  TrendingUp,
  BarChart,
  PieChart,
  Users,
  Gavel,
  Search,
  ExternalLink,
  Printer,
  Save,
  Edit,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Target,
  Shield,
  Zap
} from 'lucide-react';

// Types
interface FilingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'review';
  priority: 'high' | 'medium' | 'low';
  category: 'document' | 'calculation' | 'evidence' | 'legal' | 'filing';
  dueDate?: string;
  completedDate?: string;
  estimatedTime?: string;
  dependencies?: string[];
  notes?: string;
  documents?: string[];
}

interface CalculationStep {
  stepNumber: number;
  stepName: string;
  explanation: string;
  amount: number;
  formula?: string;
  sources?: Array<{
    documentName: string;
    documentDate: string;
    sectionName?: string;
    excerpt?: string;
  }>;
  subSteps?: CalculationStep[];
}

interface EvidenceItem {
  id: string;
  type: 'document' | 'email' | 'roa_entry' | 'calculation' | 'timeline';
  title: string;
  description: string;
  source: string;
  relevance: number;
  status: 'verified' | 'pending' | 'disputed';
  citation: string;
  excerpt?: string;
}

const CourtFilingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showCalculations, setShowCalculations] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  // Filing Tasks Checklist
  const filingTasks: FilingTask[] = useMemo(() => [
    {
      id: 'fl320-form',
      title: 'Complete FL-320 Responsive Declaration',
      description: 'Fill out the official court form with all required information',
      status: 'completed',
      priority: 'high',
      category: 'document',
      dueDate: '2025-01-15',
      completedDate: '2025-01-10',
      estimatedTime: '2 hours',
      documents: ['FL-320.pdf', 'Responsive_Declaration_Final.md']
    },
    {
      id: 'mathematical-analysis',
      title: 'Mathematical Error Analysis',
      description: 'Document the $77,779.88 double-counting error in Petitioner\'s RFO',
      status: 'completed',
      priority: 'high',
      category: 'calculation',
      dueDate: '2025-01-15',
      completedDate: '2025-01-10',
      estimatedTime: '1 hour',
      documents: ['RFO_ANALYSIS.md', 'DATA_VISUALIZATIONS.md']
    },
    {
      id: 'timeline-analysis',
      title: 'Timeline and Possession Analysis',
      description: 'Establish November 16, 2024 as possession transfer date',
      status: 'completed',
      priority: 'high',
      category: 'evidence',
      dueDate: '2025-01-15',
      completedDate: '2025-01-10',
      estimatedTime: '1 hour',
      documents: ['Timeline_Analysis.md']
    },
    {
      id: 'evidence-gathering',
      title: 'Evidence Gathering and Organization',
      description: 'Collect all supporting documents and organize by category',
      status: 'in_progress',
      priority: 'high',
      category: 'evidence',
      dueDate: '2025-01-15',
      estimatedTime: '3 hours',
      documents: ['Escrow_Statement.pdf', 'Court_Orders.pdf', 'Email_Records.pdf']
    },
    {
      id: 'legal-research',
      title: 'Legal Research and Citations',
      description: 'Research relevant case law and statutory authorities',
      status: 'pending',
      priority: 'medium',
      category: 'legal',
      dueDate: '2025-01-15',
      estimatedTime: '2 hours',
      documents: ['Legal_Authorities.md']
    },
    {
      id: 'exhibits-preparation',
      title: 'Exhibits Preparation',
      description: 'Prepare and index all exhibits for filing',
      status: 'pending',
      priority: 'high',
      category: 'document',
      dueDate: '2025-01-15',
      estimatedTime: '2 hours',
      documents: ['Exhibit_Index.md']
    },
    {
      id: 'proofreading',
      title: 'Proofreading and Review',
      description: 'Final review of all documents for accuracy and completeness',
      status: 'pending',
      priority: 'high',
      category: 'document',
      dueDate: '2025-01-15',
      estimatedTime: '1 hour',
      dependencies: ['fl320-form', 'mathematical-analysis', 'timeline-analysis']
    },
    {
      id: 'filing-submission',
      title: 'Court Filing Submission',
      description: 'Submit all documents to the court and serve on opposing counsel',
      status: 'pending',
      priority: 'high',
      category: 'filing',
      dueDate: '2025-01-15',
      estimatedTime: '30 minutes',
      dependencies: ['proofreading', 'exhibits-preparation']
    }
  ], []);

  // Financial Calculations
  const calculationSteps: CalculationStep[] = useMemo(() => [
    {
      stepNumber: 1,
      stepName: 'Gross Sale Price',
      explanation: 'The actual sale price of the property',
      amount: 1175000.00,
      formula: 'Contract Price',
      sources: [{
        documentName: 'Purchase Agreement',
        documentDate: '2025-04-16',
        sectionName: 'Purchase Price',
        excerpt: 'Buyer agrees to pay $1,175,000.00 for the property'
      }]
    },
    {
      stepNumber: 2,
      stepName: 'Less: Mortgage Payoff',
      explanation: 'Amount paid to lender at closing',
      amount: -759364.32,
      formula: 'Lender Demand',
      sources: [{
        documentName: 'Escrow Closing Statement',
        documentDate: '2025-05-30',
        sectionName: 'Line 101',
        excerpt: 'Lender Payoff: $759,364.32'
      }]
    },
    {
      stepNumber: 3,
      stepName: 'Less: Closing Costs',
      explanation: 'Real estate commissions, escrow fees, and other closing costs',
      amount: -135279.85,
      formula: 'Commissions + Fees',
      sources: [{
        documentName: 'Escrow Closing Statement',
        documentDate: '2025-05-30',
        sectionName: 'Lines 102-150',
        excerpt: 'Total closing costs: $135,279.85'
      }]
    },
    {
      stepNumber: 4,
      stepName: 'Net Proceeds to Sellers',
      explanation: 'Amount available for distribution to parties',
      amount: 280355.83,
      formula: 'Gross Sale - Mortgage Payoff - Closing Costs',
      sources: [{
        documentName: 'Escrow Closing Statement',
        documentDate: '2025-05-30',
        sectionName: 'Line 151',
        excerpt: 'Net Proceeds to Sellers: $280,355.83'
      }]
    },
    {
      stepNumber: 5,
      stepName: 'Petitioner\'s Share (35%)',
      explanation: 'Petitioner\'s portion per Judgment',
      amount: 98124.54,
      formula: 'Net Proceeds × 35%',
      sources: [{
        documentName: 'Judgment',
        documentDate: '2024-06-27',
        sectionName: 'Property Division',
        excerpt: 'Net proceeds divided 65% to Respondent, 35% to Petitioner'
      }]
    },
    {
      stepNumber: 6,
      stepName: 'Respondent\'s Share (65%)',
      explanation: 'Respondent\'s portion per Judgment',
      amount: 182231.29,
      formula: 'Net Proceeds × 65%',
      sources: [{
        documentName: 'Judgment',
        documentDate: '2024-06-27',
        sectionName: 'Property Division',
        excerpt: 'Net proceeds divided 65% to Respondent, 35% to Petitioner'
      }]
    }
  ], []);

  // Evidence Items
  const evidenceItems: EvidenceItem[] = useMemo(() => [
    {
      id: 'math-error',
      type: 'calculation',
      title: 'Mathematical Impossibility',
      description: 'Petitioner\'s double-counting of $77,779.88 mortgage costs',
      source: 'RFO Analysis',
      relevance: 100,
      status: 'verified',
      citation: 'Petitioner\'s RFO, Paragraph 40',
      excerpt: 'Petitioner seeks to "add back" $77,779.88 that was already deducted from sale price'
    },
    {
      id: 'possession-date',
      type: 'timeline',
      title: 'Possession Transfer Date',
      description: 'Petitioner took possession on November 16, 2024',
      source: 'Petitioner\'s Declaration',
      relevance: 95,
      status: 'verified',
      citation: 'Petitioner\'s RFO, Paragraph 19',
      excerpt: 'On November 16, 2024, I took possession of the home'
    },
    {
      id: 'ex-parte-filings',
      type: 'document',
      title: 'Ex Parte Filing Pattern',
      description: '7 ex parte filings by Petitioner showing aggressive tactics',
      source: 'Court Records',
      relevance: 90,
      status: 'verified',
      citation: 'Register of Actions',
      excerpt: 'Petitioner filed 7 ex parte motions between June 2024 and May 2025'
    },
    {
      id: 'continuance-analysis',
      type: 'calculation',
      title: 'Continuance Attribution',
      description: 'Petitioner requested 8 of 12 continuances (67%)',
      source: 'Court Records',
      relevance: 85,
      status: 'verified',
      citation: 'Register of Actions Analysis',
      excerpt: 'Petitioner\'s claim of Respondent\'s delays contradicted by data'
    },
    {
      id: 'communication-analysis',
      type: 'email',
      title: 'Communication Responsiveness',
      description: 'Respondent more responsive to realtor than Petitioner',
      source: 'Email Records',
      relevance: 80,
      status: 'verified',
      citation: 'Email Analysis with Realtor',
      excerpt: 'Respondent average response time: 1.8 days vs Petitioner\'s 2.3 days'
    }
  ], []);

  // Timeline Events
  const timelineEvents = useMemo(() => [
    { date: '2024-06-14', event: 'Petitioner files ex parte to list property', actor: 'petitioner', impact: 'high' },
    { date: '2024-07-12', event: 'Court orders property listing', actor: 'court', impact: 'medium' },
    { date: '2024-08-09', event: 'Petitioner files ex parte for sole possession', actor: 'petitioner', impact: 'high' },
    { date: '2024-10-03', event: 'Court orders Respondent to vacate', actor: 'court', impact: 'high' },
    { date: '2024-11-16', event: 'Petitioner takes possession', actor: 'petitioner', impact: 'critical' },
    { date: '2025-04-16', event: 'Buyer offers $1,150,000', actor: 'buyer', impact: 'medium' },
    { date: '2025-05-30', event: 'Property sold for $1,175,000', actor: 'buyer', impact: 'high' },
    { date: '2025-06-25', event: 'Petitioner files RFO', actor: 'petitioner', impact: 'high' }
  ], []);

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const updateTaskStatus = (taskId: string, status: FilingTask['status']) => {
    // In a real app, this would update the backend
    console.log(`Updating task ${taskId} to status ${status}`);
  };

  const printFiling = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const exportToPDF = () => {
    // In a real app, this would generate a PDF
    console.log('Exporting to PDF...');
  };

  const completedTasks = filingTasks.filter(task => task.status === 'completed').length;
  const totalTasks = filingTasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto" ref={printRef}>
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold text-blue-700 border-blue-300 bg-blue-50">
                  Court Filing Ready
                </Badge>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              FL-320 Responsive Declaration Filing Package
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              Complete single source of truth for filing responsive declaration to Petitioner's RFO
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8 bg-gradient-to-br from-white to-blue-50/30 shadow-xl border-slate-200/60">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Filing Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{completionPercentage}%</div>
                  <div className="text-sm text-slate-600">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{completedTasks}</div>
                  <div className="text-sm text-slate-600">Completed Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{filingTasks.filter(t => t.status === 'in_progress').length}</div>
                  <div className="text-sm text-slate-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{filingTasks.filter(t => t.status === 'pending').length}</div>
                  <div className="text-sm text-slate-600">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filing Tasks Checklist */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Filing Tasks Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filingTasks.map((task) => (
                  <div key={task.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          {expandedTasks.has(task.id) ? (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          task.status === 'completed' ? 'border-green-500 bg-green-500' :
                          task.status === 'in_progress' ? 'border-blue-500 bg-blue-500' :
                          task.status === 'review' ? 'border-yellow-500 bg-yellow-500' :
                          'border-slate-300'
                        }`}>
                          {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                          {task.status === 'in_progress' && <Clock className="h-4 w-4 text-white" />}
                          {task.status === 'review' && <Eye className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{task.title}</h3>
                          <p className="text-sm text-slate-600">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${
                          task.priority === 'high' ? 'border-red-300 text-red-700' :
                          task.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-green-300 text-green-700'
                        }`}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-slate-600">
                          {task.estimatedTime}
                        </Badge>
                        {task.dueDate && (
                          <Badge variant="outline" className="text-xs text-slate-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {expandedTasks.has(task.id) && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-slate-800 mb-2">Details</h4>
                            <div className="space-y-2 text-sm text-slate-600">
                              <div>Category: <span className="font-medium">{task.category}</span></div>
                              <div>Estimated Time: <span className="font-medium">{task.estimatedTime}</span></div>
                              {task.dueDate && (
                                <div>Due Date: <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span></div>
                              )}
                              {task.completedDate && (
                                <div>Completed: <span className="font-medium">{new Date(task.completedDate).toLocaleDateString()}</span></div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 mb-2">Documents</h4>
                            <div className="space-y-1">
                              {task.documents?.map((doc, index) => (
                                <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                                  <FileText className="h-3 w-3 inline mr-1" />
                                  {doc}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {task.notes && (
                          <div className="mt-4">
                            <h4 className="font-medium text-slate-800 mb-2">Notes</h4>
                            <p className="text-sm text-slate-600">{task.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Calculations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Calculator className="h-6 w-6 text-green-600" />
                Financial Calculations
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCalculations(!showCalculations)}
                  className="ml-auto"
                >
                  {showCalculations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showCalculations && (
                <div className="space-y-4">
                  {calculationSteps.map((step) => (
                    <div key={step.stepNumber} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-800">
                          {step.stepNumber}. {step.stepName}
                        </h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">
                            ${step.amount.toLocaleString()}
                          </div>
                          {step.formula && (
                            <div className="text-xs text-slate-500">{step.formula}</div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{step.explanation}</p>
                      {step.sources && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <h4 className="font-medium text-slate-800 mb-2">Sources:</h4>
                          {step.sources.map((source, index) => (
                            <div key={index} className="text-sm text-slate-600 mb-1">
                              <span className="font-medium">{source.documentName}</span> ({source.documentDate})
                              {source.sectionName && <span> - {source.sectionName}</span>}
                              {source.excerpt && (
                                <div className="text-xs text-slate-500 mt-1 italic">
                                  "{source.excerpt}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                Supporting Evidence
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEvidence(!showEvidence)}
                  className="ml-auto"
                >
                  {showEvidence ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showEvidence && (
                <div className="space-y-4">
                  {evidenceItems.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`text-xs ${
                            item.type === 'document' ? 'border-blue-300 text-blue-700' :
                            item.type === 'email' ? 'border-yellow-300 text-yellow-700' :
                            item.type === 'calculation' ? 'border-green-300 text-green-700' :
                            item.type === 'timeline' ? 'border-purple-300 text-purple-700' :
                            'border-slate-300 text-slate-700'
                          }`}>
                            {item.type.replace('_', ' ')}
                          </Badge>
                          <h3 className="font-semibold text-slate-800">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-slate-600">
                            {item.relevance}% relevance
                          </div>
                          <Badge variant="outline" className={`text-xs ${
                            item.status === 'verified' ? 'border-green-300 text-green-700' :
                            item.status === 'pending' ? 'border-yellow-300 text-yellow-700' :
                            'border-red-300 text-red-700'
                          }`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">Source:</span> {item.source}
                        </div>
                        <div className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">Citation:</span> {item.citation}
                        </div>
                        {item.excerpt && (
                          <div className="text-xs text-slate-500 mt-2 italic">
                            "{item.excerpt}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Critical Timeline
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTimeline(!showTimeline)}
                  className="ml-auto"
                >
                  {showTimeline ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showTimeline && (
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          event.actor === 'petitioner' ? 'bg-red-500' :
                          event.actor === 'respondent' ? 'bg-purple-500' :
                          event.actor === 'court' ? 'bg-blue-500' :
                          'bg-green-500'
                        } ring-2 ring-offset-2 ring-offset-background`} />
                        {index < timelineEvents.length - 1 && (
                          <div className="w-px h-8 bg-slate-300 mt-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-800">{event.event}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${
                              event.actor === 'petitioner' ? 'border-red-300 text-red-700' :
                              event.actor === 'respondent' ? 'border-purple-300 text-purple-700' :
                              event.actor === 'court' ? 'border-blue-300 text-blue-700' :
                              'border-green-300 text-green-700'
                            }`}>
                              {event.actor}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${
                              event.impact === 'critical' ? 'border-red-300 text-red-700' :
                              event.impact === 'high' ? 'border-orange-300 text-orange-700' :
                              'border-yellow-300 text-yellow-700'
                            }`}>
                              {event.impact}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <Button
              variant="outline"
              className="border-slate-300"
              onClick={exportToPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
            <Button
              onClick={printFiling}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print / Save as PDF
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 mb-8">
            <p>This filing package contains all necessary documents and calculations for the FL-320 Responsive Declaration.</p>
            <p>All calculations are based on verified sources and legal authorities.</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CourtFilingPage;
