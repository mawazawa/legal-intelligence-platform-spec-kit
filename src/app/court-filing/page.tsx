'use client';

import React, { useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageHeader } from './components/PageHeader';
import { ProgressOverview } from './components/ProgressOverview';
import { FilingTasksChecklist } from './components/FilingTasksChecklist';
import { FinancialCalculations } from './components/FinancialCalculations';
import { SupportingEvidence } from './components/SupportingEvidence';
import { CriticalTimeline } from './components/CriticalTimeline';
import { ActionButtons } from './components/ActionButtons';
import { PageFooter } from './components/PageFooter';
import { useFilingState } from './hooks/useFilingState';
import { handlePrint, handleExportToPDF } from './utils/printUtils';
import { filingTasks } from './data/filingTasks';
import { calculationSteps } from './data/calculationSteps';
import { evidenceItems } from './data/evidenceItems';
import { timelineEvents } from './data/timelineEvents';

const CourtFilingPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const {
    expandedTasks,
    showCalculations,
    showEvidence,
    showTimeline,
    toggleTaskExpansion,
    toggleCalculations,
    toggleEvidence,
    toggleTimeline,
  } = useFilingState();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8 print:bg-white print:p-0">
        <div className="max-w-7xl mx-auto" ref={printRef}>
          <PageHeader />

          <ProgressOverview tasks={filingTasks} />

          <FilingTasksChecklist
            tasks={filingTasks}
            expandedTasks={expandedTasks}
            onToggleExpand={toggleTaskExpansion}
          />

          <FinancialCalculations
            steps={calculationSteps}
            isVisible={showCalculations}
            onToggleVisibility={toggleCalculations}
          />

          <SupportingEvidence
            items={evidenceItems}
            isVisible={showEvidence}
            onToggleVisibility={toggleEvidence}
          />

          <CriticalTimeline
            events={timelineEvents}
            isVisible={showTimeline}
            onToggleVisibility={toggleTimeline}
          />

          <ActionButtons
            onPrint={handlePrint}
            onExportPDF={handleExportToPDF}
          />

          <PageFooter />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CourtFilingPage;
