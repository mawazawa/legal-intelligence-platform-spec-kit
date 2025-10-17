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
  Eye,
  EyeOff,
  ScrollText,
  Download,
  Upload,
  PenLine,
  Trash2
} from 'lucide-react';

interface RFOContent {
  text: string;
  meta: any;
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
  const [showDetailedRebuttals, setShowDetailedRebuttals] = useState(false);

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

  // Key comparison points based on the RFO content
  const comparisonPoints: ComparisonPoint[] = [
    {
      id: 'property_sale',
      title: 'Property Sale Proceeds Distribution',
      petitionerClaim: 'Respondent failed to properly account for property sale proceeds and owes additional amounts',
      respondentRebuttal: 'Property sale was handled according to Statement of Decision with proper accounting for all costs, taxes, and adjustments',
      evidence: [
        'Final Sellers Closing Statement showing actual proceeds',
        'Statement of Decision property division orders',
        'Tax withholding documentation',
        'Email evidence of cooperation during sale process'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Pages 15-25',
        respondent: 'FL-320 Financial Computation'
      }
    },
    {
      id: 'watts_charges',
      title: 'Watts Charges and Exclusive Possession',
      petitionerClaim: 'Respondent owes additional Watts charges for exclusive possession period',
      respondentRebuttal: 'Watts charges already calculated and offset in Statement of Decision; petitioner received credit for exclusive possession',
      evidence: [
        'Statement of Decision Watts calculation',
        'Exclusive possession timeline documentation',
        'Rental income offset calculations'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Pages 30-35',
        respondent: 'FL-320 Watts Analysis'
      }
    },
    {
      id: 'furniture_division',
      title: 'Furniture and Household Goods',
      petitionerClaim: 'Respondent failed to pay petitioner\'s share of furniture and household goods',
      respondentRebuttal: 'Furniture division completed per Statement of Decision; petitioner retained all furniture worth $15,000',
      evidence: [
        'Statement of Decision furniture orders',
        'Furniture inventory and valuation',
        'Evidence of petitioner\'s furniture retention'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Pages 40-45',
        respondent: 'FL-320 Furniture Analysis'
      }
    },
    {
      id: 'tax_obligations',
      title: 'Tax Obligations and Withholding',
      petitionerClaim: 'Respondent failed to properly handle tax obligations from property sale',
      respondentRebuttal: 'Tax obligations properly calculated and accounted for; petitioner\'s tax withholding already deducted from proceeds',
      evidence: [
        'Form 593 tax withholding documentation',
        'Email evidence of tax form discussions',
        'Franchise Tax Board correspondence',
        'Tax obligation calculations'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Pages 50-55',
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
                    SIDE-BY-SIDE COMPARISON AND REBUTTAL
                  </h2>
                  <p className="text-sm text-slate-600">
                    Filed: {new Date().toLocaleDateString()} | Hearing: August 28, 2025
                  </p>
                </div>

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
                          <h4 className="text-lg font-semibold text-red-700 mb-3">PETITIONER'S POSITION</h4>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Petitioner seeks additional property division amounts, claiming Respondent failed to properly 
                            account for property sale proceeds, Watts charges, furniture division, and tax obligations. 
                            Petitioner alleges Respondent owes substantial additional amounts.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-blue-700 mb-3">RESPONDENT'S REBUTTAL</h4>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Respondent demonstrates through overwhelming evidence that all property division was 
                            completed per the Statement of Decision. Petitioner's claims are factually incorrect 
                            and ignore existing court orders and documented evidence.
                          </p>
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
                                PETITIONER'S CLAIM
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
                                RESPONDENT'S REBUTTAL
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
                    {/* Petitioner's RFO */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        PETITIONER'S REQUEST FOR ORDER
                      </h4>
                      <div className="text-sm text-slate-700 space-y-2 mb-4">
                        <div><strong>Filed:</strong> June 26, 2025</div>
                        <div><strong>Pages:</strong> {petitionerRFO?.pages || 101}</div>
                        <div><strong>Attorney:</strong> Selam Gezahegn, Simon Law</div>
                        <div><strong>Hearing:</strong> August 28, 2025</div>
                      </div>
                      <div className="bg-white p-4 rounded border border-red-200 max-h-96 overflow-y-auto">
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                          {petitionerRFO?.text?.substring(0, 2000) || 'Loading RFO content...'}
                          {petitionerRFO?.text?.length > 2000 && '\n\n[... Content truncated for display ...]'}
                        </pre>
                      </div>
                    </div>

                    {/* Respondent's FL-320 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        RESPONDENT'S FL-320 RESPONSE
                      </h4>
                      <div className="text-sm text-slate-700 space-y-2 mb-4">
                        <div><strong>Filed:</strong> {new Date().toLocaleDateString()}</div>
                        <div><strong>Pages:</strong> {respondentFL320?.pages || 'TBD'}</div>
                        <div><strong>Attorney:</strong> Thomas J. Rotert</div>
                        <div><strong>Hearing:</strong> August 28, 2025</div>
                      </div>
                      <div className="bg-white p-4 rounded border border-blue-200 max-h-96 overflow-y-auto">
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                          {respondentFL320?.text?.substring(0, 2000) || 'FL-320 response in preparation. This will contain detailed rebuttals to each point raised in the RFO, supported by overwhelming evidence from the Statement of Decision, closing statements, tax documentation, and email correspondence.'}
                          {respondentFL320?.text?.length > 2000 && '\n\n[... Content truncated for display ...]'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COURT FOOTER */}
                <div className="mt-16 pt-8 border-t-2 border-slate-300">
                  <div className="text-center text-xs text-slate-500 space-y-2">
                    <div>This comparison demonstrates the factual inaccuracies in Petitioner's RFO</div>
                    <div>Respondent's FL-320 will provide comprehensive rebuttals with supporting evidence</div>
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
