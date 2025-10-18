"use client";

/**
 * RFO Opposition Filing Guide - Main Page
 * Refactored from 816 LOC to <300 LOC
 * SOLID: Single responsibility - orchestrates the filing workflow
 * DRY: All logic extracted to hooks, data modules, and components
 */

import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useRFOOpposition } from './hooks/useRFOOpposition';
import { calculateProgress } from './utils/status-helpers';
import {
  PageHeader,
  RFOTypeSelector,
  DeadlineCalculator,
  ProgressDashboard,
  ChecklistTabs,
  HelpfulResources,
  ChecklistNavigation
} from './components';

const RFOOppositionPage: React.FC = () => {
  const {
    selectedRFOType,
    setSelectedRFOType,
    hearingDate,
    setHearingDate,
    currentStep,
    setCurrentStep,
    checklistItems,
    filingDeadline,
    daysUntilDeadline,
    toggleItemStatus
  } = useRFOOpposition();

  const { requiredCompleted, totalRequired } = calculateProgress(checklistItems);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <PageHeader />

          {/* Step 1: Select RFO Type */}
          {currentStep === 1 && (
            <RFOTypeSelector
              selectedRFOType={selectedRFOType}
              onSelectRFOType={setSelectedRFOType}
              onContinue={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Deadline Calculator */}
          {currentStep === 2 && (
            <DeadlineCalculator
              hearingDate={hearingDate}
              onHearingDateChange={setHearingDate}
              filingDeadline={filingDeadline}
              daysUntilDeadline={daysUntilDeadline}
              checklistItems={checklistItems}
              onBack={() => setCurrentStep(1)}
              onContinue={() => setCurrentStep(3)}
            />
          )}

          {/* Step 3: Interactive Checklist */}
          {currentStep === 3 && (
            <>
              <ProgressDashboard
                checklistItems={checklistItems}
                daysUntilDeadline={daysUntilDeadline}
                filingDeadline={filingDeadline}
              />

              <ChecklistTabs
                checklistItems={checklistItems}
                onToggleItemStatus={toggleItemStatus}
              />

              <HelpfulResources />

              <ChecklistNavigation
                requiredCompleted={requiredCompleted}
                totalRequired={totalRequired}
                onBack={() => setCurrentStep(2)}
              />
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RFOOppositionPage;
