"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Printer } from 'lucide-react';
import TabNavigation, { TabType } from '@/components/rfo/TabNavigation';
import PetitionerView from '@/components/rfo/PetitionerView';
import RespondentView from '@/components/rfo/RespondentView';
import ComparisonView from '@/components/rfo/ComparisonView';

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
  const [activeTab, setActiveTab] = useState<TabType>('petitioner');
  const [ledger, setLedger] = useState<any>(null);

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const rfoResponse = await fetch('/api/case-financials/source?file=petitioner_rfo');
        if (rfoResponse.ok) {
          const rfoData = await rfoResponse.json();
          setPetitionerRFO({
            text: rfoData.text,
            meta: rfoData.meta,
            pages: rfoData.meta?.pages || 101
          });
        }

        const fl320Response = await fetch('/api/case-financials/source?file=respondent_fl320');
        if (fl320Response.ok) {
          const fl320Data = await fl320Response.json();
          setRespondentFL320({
            text: fl320Data.text,
            meta: fl320Data.meta,
            pages: fl320Data.meta?.pages || 0
          });
        }

        const lr = await fetch('/api/case-financials/ledger', { cache: 'no-store' })
        if (lr.ok) setLedger(await lr.json())
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
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'petitioner':
        return <PetitionerView rfoContent={petitionerRFO} />;
      case 'respondent':
        return <RespondentView fl320Content={respondentFL320} ledger={ledger} />;
      case 'comparison':
        return <ComparisonView comparisonPoints={comparisonPoints} />;
      default:
        return null;
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
        }
      `}</style>

      <TooltipProvider>
        <div ref={printRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  REQUEST FOR ORDER vs RESPONSIVE DECLARATION
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-2">
                  {activeTab === 'petitioner' && 'PETITIONER\'S PROPOSAL'}
                  {activeTab === 'respondent' && 'RESPONDENT\'S PROPOSAL'}
                  {activeTab === 'comparison' && 'SIDE-BY-SIDE COMPARISON AND REBUTTAL'}
                </h2>
                <p className="text-sm text-slate-600">
                  Filed: {new Date().toLocaleDateString()} | Hearing: August 28, 2025
                </p>
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default RFOComparisonPage;