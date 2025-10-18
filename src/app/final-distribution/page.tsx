"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TEXT_PROCESSING } from '@/constants/case-data';
import { TabNavigation } from './components/TabNavigation';
import { CalculationContent } from './components/CalculationContent';
import { ComparisonContent } from './components/ComparisonContent';
import { DeclarationsContent } from './components/DeclarationsContent';
import { useDocumentLoader } from './hooks/useDocumentLoader';
import { useSignatures } from './hooks/useSignatures';
import { useNegotiableParams } from './hooks/useNegotiableParams';
import { useCalculationResult } from './hooks/useCalculationResult';
import { sellerDeductions } from './data/seller-deductions';
import { brokerageAllocations } from './data/brokerage-allocations';
import { sodAdjustments } from './data/sod-adjustments';

// Local types - application-specific to this page
type TabType = 'calculation' | 'comparison' | 'declarations';

const FinalDistributionSSOT: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calculation');
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { petitionerRFO, petitionerDecl } = useDocumentLoader();
  const signatureHooks = useSignatures();
  const { negotiableParams, updateParameter } = useNegotiableParams();
  const calculationResult = useCalculationResult();

  // Ensure expanded before printing
  useEffect(() => {
    const onBeforePrint = () => setShowDetailedBreakdown(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeprint', onBeforePrint);
      return () => window.removeEventListener('beforeprint', onBeforePrint);
    }
  }, []);

  // Extract RFO excerpt
  const rfoAttachment7Excerpt = useMemo(() => {
    if (!petitionerRFO) return '';
    const lower = petitionerRFO.toLowerCase();
    const marker = TEXT_PROCESSING.RFO_ATTACHMENT_MARKER;
    const i = lower.indexOf(marker);
    if (i === -1) return petitionerRFO.slice(0, TEXT_PROCESSING.RFO_DEFAULT_EXCERPT_LENGTH);
    const start = Math.max(0, i - TEXT_PROCESSING.RFO_EXCERPT_CONTEXT_BEFORE);
    return petitionerRFO.slice(start, i + TEXT_PROCESSING.RFO_EXCERPT_CONTEXT_AFTER);
  }, [petitionerRFO]);

  const printCalculation = () => {
    if (printRef.current) {
      window.print();
    }
  };

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'calculation':
        return (
          <CalculationContent
            printRef={printRef}
            printCalculation={printCalculation}
            calculationResult={calculationResult}
            showDetailedBreakdown={showDetailedBreakdown}
            setShowDetailedBreakdown={setShowDetailedBreakdown}
            sellerDeductions={sellerDeductions}
            brokerageAllocations={brokerageAllocations}
            sodAdjustments={sodAdjustments}
            negotiableParams={negotiableParams}
            updateParameter={updateParameter}
            {...signatureHooks}
          />
        );
      case 'comparison':
        return <ComparisonContent />;
      case 'declarations':
        return (
          <DeclarationsContent
            rfoAttachment7Excerpt={rfoAttachment7Excerpt}
            petitionerDecl={petitionerDecl}
            rosannaFinalDistribution={calculationResult.summary.rosannaFinalDistribution}
            mathieuFinalDistribution={calculationResult.summary.mathieuFinalDistribution}
          />
        );
      default:
        return (
          <CalculationContent
            printRef={printRef}
            printCalculation={printCalculation}
            calculationResult={calculationResult}
            showDetailedBreakdown={showDetailedBreakdown}
            setShowDetailedBreakdown={setShowDetailedBreakdown}
            sellerDeductions={sellerDeductions}
            brokerageAllocations={brokerageAllocations}
            sodAdjustments={sodAdjustments}
            negotiableParams={negotiableParams}
            updateParameter={updateParameter}
            {...signatureHooks}
          />
        );
    }
  };

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

      <TooltipProvider>
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content with Top Padding for Fixed Tabs */}
        <div className="pt-20">
          {renderTabContent()}
        </div>
      </TooltipProvider>
    </>
  );
};

export default FinalDistributionSSOT;
