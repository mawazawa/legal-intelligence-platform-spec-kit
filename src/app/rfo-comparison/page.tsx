"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Printer,
  Scale as ScaleIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ScrollText,
  GitCompare
} from 'lucide-react';

interface RFOContent {
  text: string;
  meta: Record<string, unknown>;
  pages: number;
}

interface ComparisonPoint {
  id: string;
  title: string;
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: string[];
  status: 'disputed' | 'conceded' | 'neutral';
  pageRefs: {
    petitioner: string;
    respondent: string;
  };
}

const RFOComparisonPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [petitionerRFO, setPetitionerRFO] = useState<RFOContent | null>(null);
  const [respondentFL320, setRespondentFL320] = useState<RFOContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [activeTab, setActiveTab] = useState<'petitioner' | 'respondent' | 'comparison'>('petitioner');

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Load petitioner's RFO
        const rfoResponse = await fetch('/api/case-financials/source?file=petitioner_rfo');
        if (rfoResponse.ok) {
          const rfoData = await rfoResponse.json();
          setPetitionerRFO({
            text: rfoData.text,
            meta: rfoData.meta,
            pages: rfoData.meta?.pages || 101
          });
        }

        // Load respondent's FL-320 (if available)
        const fl320Response = await fetch('/api/case-financials/source?file=respondent_fl320');
        if (fl320Response.ok) {
          const fl320Data = await fl320Response.json();
          setRespondentFL320({
            text: fl320Data.text,
            meta: fl320Data.meta,
            pages: fl320Data.meta?.pages || 0
          });
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const printComparison = () => {
    window.print();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Key comparison points based on the actual RFO content
  const comparisonPoints: ComparisonPoint[] = [
    {
      id: 'net_proceeds_calculation',
      title: 'Net Proceeds Calculation',
      petitionerClaim: 'Add back $77,779.88 mortgage arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35',
      respondentRebuttal: 'Mortgage arrears were already paid from sale proceeds; cannot double-count by adding back to net proceeds',
      evidence: [
        'Final Sellers Closing Statement showing $280,355.83 net proceeds',
        'Statement of Decision property division orders',
        'Mortgage payoff documentation showing $759,364.32 paid to lender',
        'November 2024 mortgage statement showing arrears'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 11',
        respondent: 'FL-320 Financial Computation'
      }
    },
    {
      id: 'petitioner_distribution',
      title: 'Petitioner&apos;s Distribution Calculation',
      petitionerClaim: 'Petitioner receives $116,453.00 (35% of $358,155.71 = $125,354.50 minus $8,910.50 tax credit)',
      respondentRebuttal: 'Calculation based on incorrect net proceeds figure; should be based on actual $280,355.83 net proceeds',
      evidence: [
        'Petitioner&apos;s calculation: 35% × $358,155.71 = $125,354.50',
        'Tax withholding credit: $8,910.50 (65% of $13,694.62)',
        'Final amount: $125,354.50 - $8,910.50 = $116,453.00',
        'Statement of Decision 35% allocation'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Distribution Analysis'
      }
    },
    {
      id: 'respondent_distribution',
      title: 'Respondent&apos;s Distribution Calculation',
      petitionerClaim: 'Respondent receives $163,902.83 (65% of $358,155.71 = $232,801.21 minus $77,779.88 arrears = $155,001.33 plus $8,901.50 tax credit)',
      respondentRebuttal: 'Double-counting mortgage arrears; respondent already paid arrears through sale proceeds',
      evidence: [
        'Petitioner&apos;s calculation: 65% × $358,155.71 = $232,801.21',
        'Subtract arrears: $232,801.21 - $77,779.88 = $155,001.33',
        'Add tax credit: $155,001.33 + $8,901.50 = $163,902.83',
        'Statement of Decision 65% allocation'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Distribution Analysis'
      }
    },
    {
      id: 'watts_charges_additional',
      title: 'Additional Watts Charges',
      petitionerClaim: 'Respondent owes additional Watts charges: $50,395.94 (Jan 2021-Sep 2023), $266.16 (Oct-Nov 2023), $19,648.20 (Dec 2023-Nov 2024)',
      respondentRebuttal: 'Watts charges already calculated and offset in Statement of Decision; petitioner received credit for exclusive possession',
      evidence: [
        'Statement of Decision Watts calculation ($46,200 + interest)',
        'Exclusive possession timeline documentation',
        'Rental income offset calculations',
        'Petitioner&apos;s exclusive possession credit'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Watts Analysis'
      }
    },
    {
      id: 'tax_withholding_credit',
      title: 'Tax Withholding Credit',
      petitionerClaim: 'Respondent gets $8,901.50 credit (65% of $13,694.62 tax withholding)',
      respondentRebuttal: 'Tax withholding was petitioner&apos;s obligation; respondent has separate $25,432.88 tax obligation',
      evidence: [
        'Form 593 tax withholding documentation',
        'Email evidence of tax form discussions',
        'Franchise Tax Board correspondence',
        'Respondent&apos;s estimated tax obligation'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Tax Analysis'
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disputed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'conceded':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disputed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'conceded':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center text-slate-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading RFO comparison...</p>
        </div>
      </div>
    );
  }

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
            box-shadow: none !important;
            margin: 0 !important;
            max-width: none !important;
          }
          .side-by-side-container {
            display: block !important;
          }
          .side-by-side-container > div {
            width: 100% !important;
            margin-bottom: 2rem !important;
          }
        }
      `}</style>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Print Control */}
          <div className="fixed top-4 right-4 z-50 no-print">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={printComparison}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="sm"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print / Save as PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print comparison or save as PDF</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Tab Navigation */}
          <div className="fixed top-4 left-4 z-50 no-print">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('petitioner')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'petitioner'
                      ? 'bg-red-50 text-red-700 border-b-2 border-red-500'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  Petitioner&apos;s Proposal
                </button>
                <button
                  onClick={() => setActiveTab('respondent')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'respondent'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Respondent&apos;s Proposal
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'comparison'
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <GitCompare className="h-4 w-4" />
                  Side-by-Side Comparison
                </button>
              </div>
            </div>
          </div>

          {/* Court-Ready Document Layout */}
          <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-7xl rounded-lg" ref={printRef}>
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
                {/* COURT HEADER */}
                <div className="text-center mb-8 border-b-2 border-slate-300 pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    SUPERIOR COURT OF CALIFORNIA
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4">
                    COUNTY OF SAN FRANCISCO
                  </h2>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>PETITIONER: Rosanna Claire Alvero</div>
                    <div>RESPONDENT: Mathieu Christian Yves Wauters</div>
                    <div>Case No. FDI-21-794666</div>
                  </div>
                </div>

                {/* MAIN TITLE */}
                <div className="text-center mb-12">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                    REQUEST FOR ORDER vs RESPONSIVE DECLARATION
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-2">
                    {activeTab === 'petitioner' && 'PETITIONER&apos;S PROPOSAL'}
                    {activeTab === 'respondent' && 'RESPONDENT&apos;S PROPOSAL'}
                    {activeTab === 'comparison' && 'SIDE-BY-SIDE COMPARISON AND REBUTTAL'}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Filed: {new Date().toLocaleDateString()} | Hearing: August 28, 2025
                  </p>
                </div>

                {/* TAB CONTENT */}
                {activeTab === 'petitioner' && (
                  <div className="mb-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                      <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                        <AlertCircle className="h-6 w-6 mr-3" />
                        PETITIONER&apos;S REQUEST FOR ORDER
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-lg border border-red-200">
                          <h4 className="text-lg font-semibold text-red-700 mb-4">DOCUMENT INFORMATION</h4>
                          <div className="text-sm text-slate-700 space-y-2">
                            <div><strong>Filed:</strong> June 26, 2025</div>
                            <div><strong>Pages:</strong> {petitionerRFO?.pages || 101}</div>
                            <div><strong>Attorney:</strong> Selam Gezahegn, Simon Law</div>
                            <div><strong>Hearing:</strong> August 28, 2025</div>
                            <div><strong>Case No:</strong> FDI-21-794666</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border border-red-200">
                          <h4 className="text-lg font-semibold text-red-700 mb-4">KEY REQUESTS</h4>
                          <div className="text-sm text-slate-700 space-y-2">
                            <div>• Property division with add-back of mortgage arrears</div>
                            <div>• Additional Watts charges with interest</div>
                            <div>• Tax withholding credit allocation</div>
                            <div>• Attorney&apos;s fees and costs</div>
                            <div>• Cleanup and repair cost reimbursement</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-red-200 mb-6">
                        <h4 className="text-lg font-semibold text-red-700 mb-4">PETITIONER&apos;S CALCULATION METHODOLOGY</h4>
                        <div className="text-sm text-slate-700 space-y-3">
                          <div className="bg-red-100 p-4 rounded border border-red-200">
                            <strong>Step 1:</strong> Add back mortgage arrears to net proceeds<br/>
                            <span className="ml-4">$280,355.83 + $77,779.88 = $358,155.71</span>
                          </div>
                          <div className="bg-red-100 p-4 rounded border border-red-200">
                            <strong>Step 2:</strong> Divide 65/35 per Statement of Decision<br/>
                            <span className="ml-4">Petitioner (35%): $358,155.71 × 0.35 = $125,354.50</span><br/>
                            <span className="ml-4">Respondent (65%): $358,155.71 × 0.65 = $232,801.21</span>
                          </div>
                          <div className="bg-red-100 p-4 rounded border border-red-200">
                            <strong>Step 3:</strong> Apply tax withholding credit<br/>
                            <span className="ml-4">Petitioner: $125,354.50 - $8,910.50 = <strong>$116,453.00</strong></span><br/>
                            <span className="ml-4">Respondent: $232,801.21 - $77,779.88 + $8,901.50 = <strong>$163,902.83</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-red-200">
                        <h4 className="text-lg font-semibold text-red-700 mb-4">RFO CONTENT PREVIEW</h4>
                        <div className="bg-slate-50 p-4 rounded border border-red-200 max-h-96 overflow-y-auto">
                          <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                            {petitionerRFO?.text?.substring(0, 3000) || 'Loading RFO content...'}
                            {(petitionerRFO?.text?.length || 0) > 3000 && '\n\n[... Content truncated for display ...]'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'respondent' && (
                  <div className="mb-12">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                      <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                        <CheckCircle2 className="h-6 w-6 mr-3" />
                        RESPONDENT&apos;S FL-320 RESPONSE
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-lg border border-blue-200">
                          <h4 className="text-lg font-semibold text-blue-700 mb-4">DOCUMENT INFORMATION</h4>
                          <div className="text-sm text-slate-700 space-y-2">
                            <div><strong>Filed:</strong> {new Date().toLocaleDateString()}</div>
                            <div><strong>Pages:</strong> {respondentFL320?.pages || 'TBD'}</div>
                            <div><strong>Attorney:</strong> Thomas J. Rotert</div>
                            <div><strong>Hearing:</strong> August 28, 2025</div>
                            <div><strong>Case No:</strong> FDI-21-794666</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border border-blue-200">
                          <h4 className="text-lg font-semibold text-blue-700 mb-4">KEY REBUTTALS</h4>
                          <div className="text-sm text-slate-700 space-y-2">
                            <div>• Correct net proceeds calculation</div>
                            <div>• Statement of Decision compliance</div>
                            <div>• Tax obligation symmetry</div>
                            <div>• Watts charges already calculated</div>
                            <div>• Furniture division completed</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6">
                        <h4 className="text-lg font-semibold text-blue-700 mb-4">RESPONDENT&apos;S CORRECT CALCULATION</h4>
                        <div className="text-sm text-slate-700 space-y-3">
                          <div className="bg-blue-100 p-4 rounded border border-blue-200">
                            <strong>Step 1:</strong> Use actual net proceeds from closing statement<br/>
                            <span className="ml-4">Net proceeds: $280,355.83 (per closing statement)</span>
                          </div>
                          <div className="bg-blue-100 p-4 rounded border border-blue-200">
                            <strong>Step 2:</strong> Divide 65/35 per Statement of Decision<br/>
                            <span className="ml-4">Petitioner (35%): $280,355.83 × 0.35 = $98,124.54</span><br/>
                            <span className="ml-4">Respondent (65%): $280,355.83 × 0.65 = $182,231.29</span>
                          </div>
                          <div className="bg-blue-100 p-4 rounded border border-blue-200">
                            <strong>Step 3:</strong> Apply Statement of Decision adjustments<br/>
                            <span className="ml-4">Watts charges, furniture, rental income offsets</span>
                          </div>
                          <div className="bg-blue-100 p-4 rounded border border-blue-200">
                            <strong>Step 4:</strong> Account for tax obligations<br/>
                            <span className="ml-4">Petitioner&apos;s withholding: $13,694.62</span><br/>
                            <span className="ml-4">Respondent&apos;s estimated tax: $25,432.88</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-700 mb-4">FL-320 CONTENT PREVIEW</h4>
                        <div className="bg-slate-50 p-4 rounded border border-blue-200 max-h-96 overflow-y-auto">
                          <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                            {respondentFL320?.text?.substring(0, 3000) || 'FL-320 response in preparation. This will contain detailed rebuttals to each point raised in the RFO, supported by overwhelming evidence from the Statement of Decision, closing statements, tax documentation, and email correspondence.'}
                            {(respondentFL320?.text?.length || 0) > 3000 && '\n\n[... Content truncated for display ...]'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comparison' && (
                  <>
                    {/* OVERVIEW SECTION */}
                    <div className="mb-12">
                      <div 
                        className="flex items-center justify-between cursor-pointer mb-4"
                        onClick={() => toggleSection('overview')}
                      >
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
                          <ScaleIcon className="h-6 w-6 mr-3 text-blue-600" />
                          EXECUTIVE SUMMARY
                        </h3>
                        {expandedSections.has('overview') ? 
                          <ChevronDown className="h-6 w-6 text-slate-600" /> : 
                          <ChevronRight className="h-6 w-6 text-slate-600" />
                        }
                      </div>
                      
                      {expandedSections.has('overview') && (
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-lg font-semibold text-red-700 mb-3">PETITIONER&apos;S POSITION</h4>
                              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Petitioner claims Respondent owes additional amounts by adding back $77,779.88 mortgage 
                                arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35.
                              </p>
                              <div className="text-xs text-slate-600 bg-red-100 p-3 rounded">
                                <strong>Petitioner&apos;s Calculation:</strong><br/>
                                • Net proceeds: $358,155.71 (with add-back)<br/>
                                • Petitioner (35%): $116,453.00<br/>
                                • Respondent (65%): $163,902.83<br/>
                                • Plus additional Watts charges and interest
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-blue-700 mb-3">RESPONDENT&apos;S REBUTTAL</h4>
                              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                Respondent demonstrates that Petitioner&apos;s calculation double-counts mortgage arrears 
                                that were already paid from sale proceeds. The correct calculation uses actual net 
                                proceeds of $280,355.83 per the closing statement.
                              </p>
                              <div className="text-xs text-slate-600 bg-blue-100 p-3 rounded">
                                <strong>Respondent&apos;s Correct Calculation:</strong><br/>
                                • Net proceeds: $280,355.83 (actual closing)<br/>
                                • Petitioner (35%): $98,124.54<br/>
                                • Respondent (65%): $182,231.29<br/>
                                • Plus Statement of Decision adjustments
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SIDE-BY-SIDE COMPARISON */}
                    <div className="mb-12">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
                        <ScrollText className="h-6 w-6 mr-3 text-blue-600" />
                        DETAILED COMPARISON BY ISSUE
                      </h3>

                      <div className="space-y-8">
                        {comparisonPoints.map((point) => (
                          <Card key={point.id} className="border border-slate-200">
                            <CardHeader className="bg-slate-50">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                  {point.title}
                                </CardTitle>
                                <Badge className={`${getStatusColor(point.status)} border`}>
                                  {getStatusIcon(point.status)}
                                  <span className="ml-2 capitalize">{point.status}</span>
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Petitioner's Claim */}
                                <div className="border-r border-slate-200 pr-6">
                                  <h4 className="text-md font-semibold text-red-700 mb-3 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    PETITIONER&apos;S CLAIM
                                  </h4>
                                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    {point.petitionerClaim}
                                  </p>
                                  <div className="text-xs text-slate-500">
                                    Reference: {point.pageRefs.petitioner}
                                  </div>
                                </div>

                                {/* Respondent's Rebuttal */}
                                <div className="pl-6">
                                  <h4 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    RESPONDENT&apos;S REBUTTAL
                                  </h4>
                                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                    {point.respondentRebuttal}
                                  </p>
                                  <div className="text-xs text-slate-500">
                                    Reference: {point.pageRefs.respondent}
                                  </div>
                                </div>
                              </div>

                              {/* Supporting Evidence */}
                              <div className="mt-6 pt-4 border-t border-slate-200">
                                <h5 className="text-sm font-semibold text-slate-700 mb-3">SUPPORTING EVIDENCE</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {point.evidence.map((evidence, index) => (
                                    <div key={index} className="flex items-center text-xs text-slate-600">
                                      <FileText className="h-3 w-3 mr-2 text-blue-500" />
                                      {evidence}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* DOCUMENT COMPARISON */}
                    <div className="mb-12">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-blue-600" />
                        DOCUMENT COMPARISON
                      </h3>

                      <div className="side-by-side-container grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Petitioner's RFO (LEFT SIDE) */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            PETITIONER&apos;S REQUEST FOR ORDER
                          </h4>
                          <div className="text-sm text-slate-700 space-y-2 mb-4">
                            <div><strong>Filed:</strong> June 26, 2025</div>
                            <div><strong>Pages:</strong> {petitionerRFO?.pages || 101}</div>
                            <div><strong>Attorney:</strong> Selam Gezahegn, Simon Law</div>
                            <div><strong>Hearing:</strong> August 28, 2025</div>
                          </div>
                          
                          {/* Petitioner's Actual Calculation */}
                          <div className="bg-white p-4 rounded border border-red-200 mb-4">
                            <h5 className="text-sm font-semibold text-red-700 mb-3">PETITIONER&apos;S CALCULATION</h5>
                            <div className="text-xs text-slate-700 space-y-2">
                              <div><strong>Step 1:</strong> Add back mortgage arrears to net proceeds</div>
                              <div className="ml-4">$280,355.83 + $77,779.88 = $358,155.71</div>
                              <div><strong>Step 2:</strong> Divide 65/35 per Statement of Decision</div>
                              <div className="ml-4">Petitioner (35%): $358,155.71 × 0.35 = $125,354.50</div>
                              <div className="ml-4">Respondent (65%): $358,155.71 × 0.65 = $232,801.21</div>
                              <div><strong>Step 3:</strong> Apply tax withholding credit</div>
                              <div className="ml-4">Petitioner: $125,354.50 - $8,910.50 = <strong>$116,453.00</strong></div>
                              <div className="ml-4">Respondent: $232,801.21 - $77,779.88 + $8,901.50 = <strong>$163,902.83</strong></div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded border border-red-200 max-h-96 overflow-y-auto">
                            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                              {petitionerRFO?.text?.substring(0, 2000) || 'Loading RFO content...'}
                              {(petitionerRFO?.text?.length || 0) > 2000 && '\n\n[... Content truncated for display ...]'}
                            </pre>
                          </div>
                        </div>

                        {/* Respondent's FL-320 (RIGHT SIDE) */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            RESPONDENT&apos;S FL-320 RESPONSE
                          </h4>
                          <div className="text-sm text-slate-700 space-y-2 mb-4">
                            <div><strong>Filed:</strong> {new Date().toLocaleDateString()}</div>
                            <div><strong>Pages:</strong> {respondentFL320?.pages || 'TBD'}</div>
                            <div><strong>Attorney:</strong> Thomas J. Rotert</div>
                            <div><strong>Hearing:</strong> August 28, 2025</div>
                          </div>

                          {/* Respondent's Correct Calculation */}
                          <div className="bg-white p-4 rounded border border-blue-200 mb-4">
                            <h5 className="text-sm font-semibold text-blue-700 mb-3">RESPONDENT&apos;S CORRECT CALCULATION</h5>
                            <div className="text-xs text-slate-700 space-y-2">
                              <div><strong>Step 1:</strong> Use actual net proceeds from closing statement</div>
                              <div className="ml-4">Net proceeds: $280,355.83 (per closing statement)</div>
                              <div><strong>Step 2:</strong> Divide 65/35 per Statement of Decision</div>
                              <div className="ml-4">Petitioner (35%): $280,355.83 × 0.35 = $98,124.54</div>
                              <div className="ml-4">Respondent (65%): $280,355.83 × 0.65 = $182,231.29</div>
                              <div><strong>Step 3:</strong> Apply Statement of Decision adjustments</div>
                              <div className="ml-4">Watts charges, furniture, rental income offsets</div>
                              <div><strong>Step 4:</strong> Account for tax obligations</div>
                              <div className="ml-4">Petitioner&apos;s withholding: $13,694.62</div>
                              <div className="ml-4">Respondent&apos;s estimated tax: $25,432.88</div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded border border-blue-200 max-h-96 overflow-y-auto">
                            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                              {respondentFL320?.text?.substring(0, 2000) || 'FL-320 response in preparation. This will contain detailed rebuttals to each point raised in the RFO, supported by overwhelming evidence from the Statement of Decision, closing statements, tax documentation, and email correspondence.'}
                              {(respondentFL320?.text?.length || 0) > 2000 && '\n\n[... Content truncated for display ...]'}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* COURT FOOTER */}
                <div className="mt-16 pt-8 border-t-2 border-slate-300">
                    <div className="text-center text-xs text-slate-500 space-y-2">
                      <div>This comparison demonstrates the factual inaccuracies in Petitioner&apos;s RFO</div>
                      <div>Respondent&apos;s FL-320 will provide comprehensive rebuttals with supporting evidence</div>
                    <div>Filed: {new Date().toLocaleDateString()} | Case No. FDI-21-794666</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default RFOComparisonPage;
