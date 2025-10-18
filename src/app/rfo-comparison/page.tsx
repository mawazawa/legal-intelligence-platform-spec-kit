"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Printer } from 'lucide-react';
import { logger } from '@/lib/logging/logger';
import { safeFetch } from '@/lib/api/fetch';
import TabNavigation, { TabType } from '@/components/rfo/TabNavigation';
import PetitionerView from '@/components/rfo/PetitionerView';
import RespondentView from '@/components/rfo/RespondentView';
import FeedbackModal from '@/components/rfo/FeedbackModal';
import { DistributionSummary } from './components/DistributionSummary';
import { useDocuments } from './hooks/useDocuments';

const RFOComparisonPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { petitionerRFO, respondentFL320, ledger, loading, error: loadError } = useDocuments();
  const [activeTab, setActiveTab] = useState<TabType>('petitioner');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    claim: string;
    annotation: string;
    timestamp: Date;
    evidence?: string[];
  }>>([]);

  const handleAddAnnotation = (annotation: Omit<typeof annotations[0], 'id' | 'timestamp'>) => {
    const newAnnotation = {
      ...annotation,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleSearchEvidence = async (query: string): Promise<string[]> => {
    try {
      const result = await safeFetch<{ results?: string[] }>(
        `/api/search/emails?q=${encodeURIComponent(query)}`,
        { timeout: 10000, retries: 1 }
      );

      if (result.data) {
        logger.debug('Email search successful', { query, resultCount: result.data.results?.length || 0 });
        return result.data.results || [];
      }
    } catch (err) {
      logger.error('Email search exception', err as Error, { query });
    }

    logger.debug('Using mock email search results', { query });
    return [
      `Email from Selam Gezahegn dated May 24, 2023 regarding ${query}`,
      `Correspondence with Rosey Alvero about ${query}`,
      `Legal communication referencing ${query}`
    ];
  };

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
    <TooltipProvider>
      <div ref={printRef} className="legal-document min-h-screen bg-gray-50 py-8">
        <div className="fixed top-4 right-4 z-50 no-print">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => window.print()}
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

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                REQUEST FOR ORDER vs RESPONSIVE DECLARATION
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
                {activeTab === 'petitioner' && 'PETITIONER\'S PROPOSAL'}
                {activeTab === 'respondent' && 'RESPONDENT\'S PROPOSAL'}
                {activeTab === 'comparison' && 'SIDE-BY-SIDE COMPARISON AND REBUTTAL'}
              </h2>

              <DistributionSummary />

              <p className="text-sm text-slate-600">
                Filed: {new Date().toLocaleDateString()} | Hearing: August 28, 2025
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              <div className="letter-page bg-white">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-red-700 mb-4 border-b-2 border-red-200 pb-2">
                    PETITIONER'S CLAIMS
                  </h3>
                  <PetitionerView rfoContent={petitionerRFO} />
                </div>
              </div>

              <div className="letter-page bg-white">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-blue-200 pb-2">
                    RESPONDENT'S COUNTER
                  </h3>
                  <RespondentView fl320Content={respondentFL320} ledger={ledger} />
                </div>
              </div>
            </div>

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

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        annotations={annotations}
        onAddAnnotation={handleAddAnnotation}
        onSearchEvidence={handleSearchEvidence}
      />
    </TooltipProvider>
  );
};

export default RFOComparisonPage;
