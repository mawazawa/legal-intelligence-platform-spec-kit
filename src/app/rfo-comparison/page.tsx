"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Printer } from 'lucide-react';
import TabNavigation, { TabType } from '@/components/rfo/TabNavigation';
import PetitionerView from '@/components/rfo/PetitionerView';
import RespondentView from '@/components/rfo/RespondentView';
import ComparisonView from '@/components/rfo/ComparisonView';
import FeedbackModal from '@/components/rfo/FeedbackModal';

interface RFOContent {
  text: string;
  meta: Record<string, unknown>;
  pages: number;
}

interface ComparisonPoint {
  id: string;
  title: string;
  presentedBy: 'Petitioner' | 'Attorney';
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: string[];
  feedback: string[];
  status: 'disputed' | 'conceded' | 'neutral';
  pageRefs: {
    petitioner: string;
    respondent: string;
  };
  clarifyingPrompts?: string[];
}

const RFOComparisonPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [petitionerRFO, setPetitionerRFO] = useState<RFOContent | null>(null);
  const [respondentFL320, setRespondentFL320] = useState<RFOContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('petitioner');
  const [ledger, setLedger] = useState<Record<string, unknown> | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    claim: string;
    annotation: string;
    timestamp: Date;
    evidence?: string[];
  }>>([]);
  // Components are statically imported and mounted once; we toggle visibility for instant switching

  // Load documents with parallel fetching
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Parallel fetch for better performance
        const [rfoResponse, fl320Response, ledgerResponse] = await Promise.all([
          fetch('/api/case-financials/source?file=petitioner_rfo'),
          fetch('/api/case-financials/source?file=respondent_fl320'),
          fetch('/api/case-financials/ledger', { cache: 'no-store' })
        ]);

        // Process responses in parallel
        const [rfoData, fl320Data, ledgerData] = await Promise.all([
          rfoResponse.ok ? rfoResponse.json() : null,
          fl320Response.ok ? fl320Response.json() : null,
          ledgerResponse.ok ? ledgerResponse.json() : null,
        ]);

        if (rfoData) {
          setPetitionerRFO({
            text: rfoData.text,
            meta: rfoData.meta,
            pages: rfoData.meta?.pages || 101
          });
        }

        if (fl320Data) {
          setRespondentFL320({
            text: fl320Data.text,
            meta: fl320Data.meta,
            pages: fl320Data.meta?.pages || 0
          });
        }

        if (ledgerData) {
          setLedger(ledgerData);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const printCalculation = () => {
    window.print();
  };

  const handleAddAnnotation = (annotation: Omit<typeof annotations[0], 'id' | 'timestamp'>) => {
    const newAnnotation = {
      ...annotation,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleSearchEvidence = async (query: string): Promise<string[]> => {
    // Simulate email search - in real implementation, this would search mbox files
    try {
      const response = await fetch(`/api/search/emails?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    } catch (error) {
      console.error('Email search failed:', error);
    }
    
    // Fallback to mock results for demonstration
    return [
      `Email from Selam Gezahegn dated May 24, 2023 regarding ${query}`,
      `Correspondence with Rosey Alvero about ${query}`,
      `Legal communication referencing ${query}`
    ];
  };

  // Memoize comparison points to prevent recreation on every render
  const comparisonPoints: ComparisonPoint[] = useMemo(() => [
    {
      id: 'net_proceeds_calculation',
      title: 'Net Proceeds Calculation',
      presentedBy: 'Petitioner',
      petitionerClaim: 'Add back $77,779.88 mortgage arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35',
      respondentRebuttal: 'Mortgage arrears were already paid from sale proceeds; cannot double-count by adding back to net proceeds',
      evidence: [
        'Final Sellers Closing Statement showing $280,355.83 net proceeds',
        'Statement of Decision property division orders',
        'Mortgage payoff documentation showing $759,364.32 paid to lender',
        'November 2024 mortgage statement showing arrears'
      ],
      feedback: [
        'This claim ignores that the arrears line was already satisfied at closing—flag the duplicate recovery attempt.',
        'Highlight escrow math: the closing statement already nets arrears before distribution.'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 11',
        respondent: 'FL-320 Financial Computation'
      },
      clarifyingPrompts: [
        'Confirm whether any arrears remained unpaid post-close.',
        'Ask if Petitioner has a ledger showing arrears as a receivable after escrow.'
      ]
    },
    {
      id: 'petitioner_distribution',
      title: 'Petitioner&apos;s Distribution Calculation',
      presentedBy: 'Attorney',
      petitionerClaim: 'Petitioner receives $116,453.00 (35% of $358,155.71 = $125,354.50 minus $8,910.50 tax credit)',
      respondentRebuttal: 'Calculation based on incorrect net proceeds figure; should be based on actual $280,355.83 net proceeds',
      evidence: [
        'Petitioner&apos;s calculation: 35% × $358,155.71 = $125,354.50',
        'Tax withholding credit: $8,910.50 (65% of $13,694.62)',
        'Final amount: $125,354.50 - $8,910.50 = $116,453.00',
        'Statement of Decision 35% allocation'
      ],
      feedback: [
        'Attorney is anchoring off a gross figure that never passed through escrow—note the variance between SOD math and closing math.',
        'Call out that withholding credit should be symmetrical for both parties per SOD.'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Distribution Analysis'
      },
      clarifyingPrompts: [
        'Ask for attorney workpapers supporting $358,155.71 as distributable base.',
        'Verify if tax credits were applied consistently to both parties in their exhibit.'
      ]
    },
    {
      id: 'respondent_distribution',
      title: 'Respondent&apos;s Distribution Calculation',
      presentedBy: 'Attorney',
      petitionerClaim: 'Respondent receives $163,902.83 (65% of $358,155.71 = $232,801.21 minus $77,779.88 arrears = $155,001.33 plus $8,901.50 tax credit)',
      respondentRebuttal: 'Double-counting mortgage arrears; respondent already paid arrears through sale proceeds',
      evidence: [
        'Petitioner&apos;s calculation: 65% × $358,155.71 = $232,801.21',
        'Subtract arrears: $232,801.21 - $77,779.88 = $155,001.33',
        'Add tax credit: $155,001.33 + $8,901.50 = $163,902.83',
        'Statement of Decision 65% allocation'
      ],
      feedback: [
        'Point out that Respondent’s tax credit is cherry-picked—compare to Form 593 showing parallel withholding.',
        'Consider attaching escrow wire confirmation proving arrears payoff occurred before the split.'
      ],
      status: 'disputed',
      pageRefs: {
        petitioner: 'RFO Attachment 7, Page 5',
        respondent: 'FL-320 Distribution Analysis'
      },
      clarifyingPrompts: [
        'Do they contend arrears were not wired at close? If so, request supporting payoff statements.',
        'Confirm whether any escrow amendment exists showing arrears exception.'
      ]
    }
  ], []); // Empty dependency array - comparison points are static

  const isActive = (tab: TabType) => activeTab === tab;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-slate-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading RFO comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print styles moved to globals.css */}

      <TooltipProvider>
        <div ref={printRef} className="legal-document min-h-screen bg-gray-50 py-8">
          {/* Print Button */}
          <div className="fixed top-4 right-4 z-50 no-print">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={printCalculation}
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
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content */}
          <div className="pt-20 px-4 pb-8">
            <div className="max-w-7xl mx-auto">
              {/* Header with Bottom Line Calculations */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  REQUEST FOR ORDER vs RESPONSIVE DECLARATION
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
                  {activeTab === 'petitioner' && 'PETITIONER\'S PROPOSAL'}
                  {activeTab === 'respondent' && 'RESPONDENT\'S PROPOSAL'}
                  {activeTab === 'comparison' && 'SIDE-BY-SIDE COMPARISON AND REBUTTAL'}
                </h2>
                
                {/* Bottom Line Calculations - Prominent Display */}
                <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">BOTTOM LINE DISTRIBUTION</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-bold text-red-800 mb-2">PETITIONER'S CALCULATION</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Net Proceeds (with add-back):</span>
                          <span className="font-mono font-bold">$358,155.71</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Petitioner (35%):</span>
                          <span className="font-mono font-bold text-red-700">$116,453.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Respondent (65%):</span>
                          <span className="font-mono font-bold text-red-700">$163,902.83</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="font-mono">$280,355.83</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-800 mb-2">RESPONDENT'S CALCULATION</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Net Proceeds (actual):</span>
                          <span className="font-mono font-bold">$280,355.83</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Petitioner (35%):</span>
                          <span className="font-mono font-bold text-blue-700">$98,124.54</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Respondent (65%):</span>
                          <span className="font-mono font-bold text-blue-700">$182,231.29</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="font-mono">$280,355.83</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800 font-semibold">
                      <strong>DISCREPANCY:</strong> Petitioner's calculation inflates her share by $18,328.46 
                      and reduces Respondent's share by $18,328.46 through improper "add-back" methodology.
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600">
                  Filed: {new Date().toLocaleDateString()} | Hearing: August 28, 2025
                </p>
              </div>

              {/* Side-by-Side Layout for Letter-Sized Sheets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {/* Left Sheet - Petitioner's Claims */}
                <div className="letter-page bg-white">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-red-700 mb-4 border-b-2 border-red-200 pb-2">
                      PETITIONER'S CLAIMS
                    </h3>
                    <PetitionerView rfoContent={petitionerRFO} />
                  </div>
                </div>

                {/* Right Sheet - Respondent's Counter */}
                <div className="letter-page bg-white">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-blue-200 pb-2">
                      RESPONDENT'S COUNTER
                    </h3>
                    <RespondentView fl320Content={respondentFL320} ledger={ledger} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="fixed bottom-4 right-4 z-50 no-print flex gap-2">
                <Button
                  onClick={() => window.open('/case-workspace', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  size="sm"
                >
                  📁 Case Workspace
                </Button>
                <Button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                  size="sm"
                >
                  💬 Add Annotation
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          annotations={annotations}
          onAddAnnotation={handleAddAnnotation}
          onSearchEvidence={handleSearchEvidence}
        />
      </TooltipProvider>
    </>
  );
};

export default RFOComparisonPage;
