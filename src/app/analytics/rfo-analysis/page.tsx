'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import PageSkeleton from '@/components/loading/PageSkeleton';
import { useRFOAnalysis } from './hooks/useRFOAnalysis';
import { PageHeader } from './components/PageHeader';
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { TabNavigation } from './components/TabNavigation';
import { ExportButtons } from './components/ExportButtons';
import { OverviewTab } from './components/tabs/OverviewTab';
import { MathematicalErrorsTab } from './components/tabs/MathematicalErrorsTab';
import { TimelineAnalysisTab } from './components/tabs/TimelineAnalysisTab';
import { CommunicationsTab } from './components/tabs/CommunicationsTab';
import { FinancialClaimsTab } from './components/tabs/FinancialClaimsTab';
import { EX_PARTE_TIMELINE } from './mockData';

const RFOAnalysisPage: React.FC = () => {
  const { analysisData, loading, activeTab, setActiveTab } = useRFOAnalysis();

  if (loading) {
    return <PageSkeleton type="analytics" />;
  }

  if (!analysisData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Failed to load analysis data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          invalidPercentage={analysisData.summary.invalidPercentage}
          analysisDate={analysisData.summary.analysisDate}
        />

        <ExecutiveSummaryCards
          summary={analysisData.summary}
          netProceeds={analysisData.propertyDetails.netProceeds}
        />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'overview' && <OverviewTab data={analysisData} />}

        {activeTab === 'mathematical' && <MathematicalErrorsTab data={analysisData} />}

        {activeTab === 'timeline' && (
          <TimelineAnalysisTab data={analysisData} exParteTimeline={EX_PARTE_TIMELINE} />
        )}

        {activeTab === 'communications' && <CommunicationsTab data={analysisData} />}

        {activeTab === 'financial' && <FinancialClaimsTab data={analysisData} />}

        <ExportButtons />
      </div>
    </div>
  );
};

export default RFOAnalysisPage;
