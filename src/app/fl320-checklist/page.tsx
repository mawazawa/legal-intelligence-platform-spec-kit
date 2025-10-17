"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
// Removed PDF generation dependencies - using browser print-to-PDF instead
import {
  FileText,
  Printer,
  CheckCircle2,
  Circle,
  Scale as ScaleIcon,
  FolderOpen,
  FileCheck,
  Clock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category: 'form' | 'declaration' | 'exhibit' | 'supporting';
  filePath?: string;
  dueDate?: string;
  notes?: string;
}

const FL320_CHECKLIST_TEMPLATE = `# FL-320 Responsive Declaration Court Packet Checklist

## Required Forms
- [ ] **FL-320 Responsive Declaration** - Main responsive declaration form
- [ ] **FL-320-INFO** - Information sheet for FL-320 (if applicable)

## Supporting Declarations
- [ ] **Declaration of Thomas J. Rotert** - Attorney declaration with legal arguments
- [ ] **Declaration of Mathieu Wauters** - Respondent's personal declaration
- [ ] **Declaration of [Additional Witness]** - Supporting witness declarations (if any)

## Memorandum of Points and Authorities
- [ ] **Memo of Points and Authorities** - Legal brief supporting the responsive declaration
- [ ] **Table of Authorities** - Legal citations and case law references

## Indexed List of Exhibits
- [ ] **Indexed List of Exhibits** - Comprehensive list of all supporting documents
- [ ] **Exhibit A** - Statement of Decision (SOD) - Court's final judgment
- [ ] **Exhibit B** - Final Sellers Closing Statement - Property sale documentation
- [ ] **Exhibit C** - Lakeview Mortgage Payoff Statement - Mortgage details
- [ ] **Exhibit D** - Tax Withholding Documentation - Form 593 and related tax forms
- [ ] **Exhibit E** - Email Evidence - Tax withholding discussions (May 30, 2025)
- [ ] **Exhibit F** - Financial Computation Exhibit - Detailed calculation breakdown
- [ ] **Exhibit G** - Supporting Documentation - Additional evidence as needed

## Financial Documentation
- [ ] **Detailed Financial Computation** - Step-by-step calculation with sources
- [ ] **Property Sale Analysis** - Complete breakdown of sale proceeds
- [ ] **Tax Obligation Analysis** - Mathieu's estimated $25k tax obligation
- [ ] **Watts Charges Calculation** - Exclusive possession charges breakdown
- [ ] **Furniture Reversal Documentation** - $15,000 furniture retention evidence

## Legal Research and Citations
- [ ] **Family Code § 2550** - Equal division of community property
- [ ] **Family Code § 2552** - Court's authority to adjust property division
- [ ] **Revenue and Taxation Code § 2187** - Tax withholding requirements
- [ ] **Case Law Precedents** - Supporting legal authorities

## Court Filing Requirements
- [ ] **Proof of Service** - Service on opposing party
- [ ] **Filing Fee** - Court filing fee payment
- [ ] **Conformed Copies** - Copies for court and parties
- [ ] **Electronic Filing** - E-filing submission (if applicable)

## Quality Assurance
- [ ] **Legal Review** - Attorney review of all documents
- [ ] **Fact Checking** - Verification of all financial calculations
- [ ] **Citation Verification** - Confirmation of all legal citations
- [ ] **Format Compliance** - Court formatting requirements met
- [ ] **Deadline Confirmation** - Filing deadline verification

## Post-Filing Tasks
- [ ] **Service on Opposing Party** - Serve responsive declaration
- [ ] **Calendar Hearing** - Schedule any required hearings
- [ ] **Follow-up Documentation** - Additional filings as needed
- [ ] **Case Management** - Update case management system

---

## Notes and Comments
*Add any additional notes, comments, or observations here*

## Filing Deadline
**Target Filing Date:** [To be determined]
**Court:** [Court Information]
**Case Number:** FDI-21-794666
**Judge:** [Assigned Judge]

## Contact Information
**Attorney:** Thomas J. Rotert
**Client:** Mathieu Wauters
**Opposing Party:** Rosanna Alvero
**Opposing Counsel:** [To be determined]`;

const FL320_CHECKLIST: ChecklistItem[] = [
  {
    id: 'fl320-form',
    title: 'FL-320 Responsive Declaration',
    description: 'Main responsive declaration form',
    status: 'pending',
    priority: 'high',
    category: 'form',
    filePath: '/documents/FL-320-Responsive-Declaration.pdf'
  },
  {
    id: 'fl320-info',
    title: 'FL-320-INFO Information Sheet',
    description: 'Information sheet for FL-320 (if applicable)',
    status: 'pending',
    priority: 'medium',
    category: 'form',
    filePath: '/documents/FL-320-INFO.pdf'
  },
  {
    id: 'declaration-rotert',
    title: 'Declaration of Thomas J. Rotert',
    description: 'Attorney declaration with legal arguments',
    status: 'in-progress',
    priority: 'high',
    category: 'declaration',
    filePath: '/documents/Declaration-Thomas-J-Rotert.pdf'
  },
  {
    id: 'declaration-wauters',
    title: 'Declaration of Mathieu Wauters',
    description: 'Respondent\'s personal declaration',
    status: 'pending',
    priority: 'high',
    category: 'declaration',
    filePath: '/documents/Declaration-Mathieu-Wauters.pdf'
  },
  {
    id: 'memo-points-auth',
    title: 'Memo of Points and Authorities',
    description: 'Legal brief supporting the responsive declaration',
    status: 'pending',
    priority: 'high',
    category: 'declaration',
    filePath: '/documents/Memo-Points-Authorities.pdf'
  },
  {
    id: 'exhibit-index',
    title: 'Indexed List of Exhibits',
    description: 'Comprehensive list of all supporting documents',
    status: 'pending',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Exhibit-Index.pdf'
  },
  {
    id: 'exhibit-sod',
    title: 'Exhibit A - Statement of Decision',
    description: 'Court\'s final judgment and property division order',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Statement-of-Decision.pdf'
  },
  {
    id: 'exhibit-closing',
    title: 'Exhibit B - Final Sellers Closing Statement',
    description: 'Property sale documentation and proceeds breakdown',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Final-Sellers-Closing-Statement.pdf'
  },
  {
    id: 'exhibit-mortgage',
    title: 'Exhibit C - Lakeview Mortgage Payoff Statement',
    description: 'Mortgage details and payoff information',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Lakeview-Mortgage-Payoff.pdf'
  },
  {
    id: 'exhibit-tax',
    title: 'Exhibit D - Tax Withholding Documentation',
    description: 'Form 593 and related tax forms',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Tax-Withholding-Documentation.pdf'
  },
  {
    id: 'exhibit-email',
    title: 'Exhibit E - Email Evidence',
    description: 'Tax withholding discussions (May 30, 2025)',
    status: 'completed',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Email-Evidence-Tax-Withholding.pdf'
  },
  {
    id: 'exhibit-financial',
    title: 'Exhibit F - Financial Computation Exhibit',
    description: 'Detailed calculation breakdown with sources',
    status: 'in-progress',
    priority: 'high',
    category: 'exhibit',
    filePath: '/documents/Financial-Computation-Exhibit.pdf'
  },
  {
    id: 'exhibit-supporting',
    title: 'Exhibit G - Supporting Documentation',
    description: 'Additional evidence as needed',
    status: 'pending',
    priority: 'medium',
    category: 'exhibit',
    filePath: '/documents/Supporting-Documentation.pdf'
  }
];

const FL320ChecklistPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(FL320_CHECKLIST);
  const [markdownContent, setMarkdownContent] = useState(FL320_CHECKLIST_TEMPLATE);
  const [isEditing, setIsEditing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  // Parse markdown content to extract checklist items
  const parsedChecklist = useMemo(() => {
    const lines = markdownContent.split('\n');
    const items: ChecklistItem[] = [];
    let currentCategory = '';
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '').toLowerCase();
        continue;
      }
      
      if (line.includes('- [ ]') || line.includes('- [x]')) {
        const isCompleted = line.includes('- [x]');
        const titleMatch = line.match(/\*\*(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1] : line.replace(/^- \[[ x]\]\s*\*\*/, '').replace(/\*\*.*/, '');
        const description = line.replace(/^- \[[ x]\]\s*\*\*.*?\*\*\s*-\s*/, '');
        
        items.push({
          id: `item-${items.length}`,
          title,
          description,
          status: isCompleted ? 'completed' : 'pending',
          priority: 'medium',
          category: 'form' as const,
          notes: ''
        });
      }
    }
    
    return items;
  }, [markdownContent]);

  const toggleItemStatus = (itemId: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStatus = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const updateMarkdownCheckbox = (lineIndex: number, isChecked: boolean) => {
    const lines = markdownContent.split('\n');
    const line = lines[lineIndex];
    if (line.includes('- [ ]') || line.includes('- [x]')) {
      const newLine = isChecked ? line.replace('- [ ]', '- [x]') : line.replace('- [x]', '- [ ]');
      lines[lineIndex] = newLine;
      setMarkdownContent(lines.join('\n'));
    }
  };

  const printChecklist = () => {
    window.print();
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
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'form':
        return <FileText className="h-4 w-4" />;
      case 'declaration':
        return <User className="h-4 w-4" />;
      case 'exhibit':
        return <FolderOpen className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };

  const completedCount = checklistItems.filter(item => item.status === 'completed').length;
  const totalCount = checklistItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          .shadow-lg, .shadow-xl, .shadow-2xl {
            box-shadow: none !important;
          }
          .animate-in {
            animation: none !important;
          }
          .hover\\:scale-105:hover {
            transform: none !important;
          }
          .court-document {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            box-shadow: none !important;
          }
          .court-page {
            page-break-inside: avoid;
            margin: 0 !important;
            padding: 1in !important;
            background: white !important;
            border: none !important;
          }
          .court-header {
            border-bottom: 2px solid #1e293b !important;
            margin-bottom: 2rem !important;
            padding-bottom: 1rem !important;
          }
          .court-calculation {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            padding: 1.5rem !important;
            margin: 1rem 0 !important;
          }
          .court-step {
            border-left: 4px solid #3b82f6 !important;
            padding-left: 1rem !important;
            margin: 0.5rem 0 !important;
          }
          .court-footer {
            border-top: 1px solid #e2e8f0 !important;
            margin-top: 2rem !important;
            padding-top: 1rem !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Print Control */}
        <div className="fixed top-4 right-4 z-50 no-print">
          <Button
            onClick={printChecklist}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
        </div>

        {/* Court-Ready Document Layout */}
        <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-5xl rounded-lg" ref={printRef}>
          {/* Sophisticated Page Edge Shading */}
          <div className="relative">
            {/* Top Edge Shading */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none rounded-t-lg"></div>
            {/* Bottom Edge Shading */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none rounded-b-lg"></div>
            {/* Left Edge Shading */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none rounded-l-lg"></div>
            {/* Right Edge Shading */}
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none rounded-r-lg"></div>

            {/* Court Page Content */}
            <div className="court-page relative z-10 bg-white min-h-[11in] p-16 rounded-lg">
              {/* Professional Court Header */}
              <div className="court-header text-center mb-12">
                <div className="mb-6">
                  <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center justify-center">
                    <ScaleIcon className="h-10 w-10 mr-4 text-blue-600" />
                    FL-320 COURT PACKET CHECKLIST
                  </h1>
                  <h2 className="text-2xl font-bold text-slate-700 mb-4">Responsive Declaration Filing Preparation</h2>
                  <div className="flex justify-center items-center gap-8 text-sm text-slate-600">
                    <div>
                      <span className="font-semibold">Case:</span> Wauters v. Alvero
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div>
                      <span className="font-semibold">Generated:</span> {new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="court-calculation mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">FILING PROGRESS</h3>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-4xl font-black text-slate-900">
                      {completedCount}/{totalCount}
                    </div>
                    <div className="text-lg text-slate-600">
                      ({progressPercentage.toFixed(1)}% Complete)
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{completedCount} Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span>{checklistItems.filter(item => item.status === 'in-progress').length} In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-gray-400" />
                      <span>{checklistItems.filter(item => item.status === 'pending').length} Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="court-calculation mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
                    <FileCheck className="h-5 md:h-6 w-5 md:w-6 mr-2 md:mr-3 text-blue-600" />
                    CHECKLIST ITEMS
                  </h3>
                  <div className="flex gap-2 no-print">
                    <Button
                      variant="outline"
                      onClick={() => setShowCompleted(!showCompleted)}
                      className="flex items-center space-x-2"
                    >
                      {showCompleted ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span className="hidden sm:inline">Hide Completed</span>
                          <span className="sm:hidden">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Show Completed</span>
                          <span className="sm:hidden">Show</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">{isEditing ? 'View' : 'Edit'}</span>
                      <span className="sm:hidden">{isEditing ? 'View' : 'Edit'}</span>
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <Label htmlFor="markdown-content" className="text-sm font-semibold text-slate-700">
                      Edit Checklist (Markdown Format)
                    </Label>
                    <textarea
                      id="markdown-content"
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      className="min-h-[600px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter markdown checklist content..."
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setMarkdownContent(FL320_CHECKLIST_TEMPLATE)}>
                        Reset to Template
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {checklistItems
                      .filter(item => showCompleted || item.status !== 'completed')
                      .map((item) => (
                        <Card 
                          key={item.id} 
                          className={`border-l-4 ${
                            item.status === 'completed' ? 'border-l-green-500 bg-green-50' :
                            item.status === 'in-progress' ? 'border-l-yellow-500 bg-yellow-50' :
                            'border-l-gray-300 bg-white'
                          } shadow-lg hover:shadow-xl transition-all duration-300`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <button
                                  onClick={() => toggleItemStatus(item.id)}
                                  className="mt-1 hover:scale-110 transition-transform duration-200"
                                  aria-label={`Toggle ${item.title}`}
                                >
                                  {getStatusIcon(item.status)}
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                                    <Badge className={getPriorityColor(item.priority)}>
                                      {item.priority.toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      {getCategoryIcon(item.category)}
                                      <span className="capitalize">{item.category}</span>
                                    </Badge>
                                  </div>
                                  <p className="text-slate-600 mb-3">{item.description}</p>
                                  {item.filePath && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                      <FileText className="h-4 w-4" />
                                      <span>{item.filePath}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>

              {/* Markdown Rendered Checklist */}
              <div className="court-calculation mb-12">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  RENDERED CHECKLIST
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">
                    {markdownContent}
                  </pre>
                </div>
              </div>

              {/* Court Footer */}
              <div className="court-footer mt-16 pt-8 border-t-2 border-slate-300 text-center">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">LEGAL DISCLAIMER</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mx-auto mb-4">
                    This checklist is for organizational purposes only and should not replace professional legal advice.
                    Please consult with your attorney before making any legal decisions or filings.
                    All deadlines and requirements should be verified with the court and applicable rules.
                  </p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p><strong>Case:</strong> Wauters v. Alvero | <strong>Case Number:</strong> FDI-21-794666</p>
                    <p><strong>Checklist Date:</strong> {new Date().toLocaleDateString()} | <strong>Version:</strong> 1.0</p>
                    <p><strong>Generated for:</strong> FL-320 Responsive Declaration Filing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FL320ChecklistPage;
