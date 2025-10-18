"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useChecklistState } from './hooks/useChecklistState';
import { calculateProgress } from './utils/checklist-utils';
import { PrintStyles } from './components/PrintStyles';
import { ChecklistHeader } from './components/ChecklistHeader';
import { ProgressSummary } from './components/ProgressSummary';
import { ChecklistItemsList } from './components/ChecklistItemsList';
import { ChecklistEditor } from './components/ChecklistEditor';
import { RenderedChecklist } from './components/RenderedChecklist';
import { CourtFooter } from './components/CourtFooter';

const FL320ChecklistPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const {
    checklistItems,
    markdownContent,
    setMarkdownContent,
    isEditing,
    setIsEditing,
    showCompleted,
    setShowCompleted,
    toggleItemStatus,
    resetToTemplate
  } = useChecklistState();

  const progress = calculateProgress(checklistItems);

  const printChecklist = () => {
    window.print();
  };

  return (
    <>
      <PrintStyles />

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
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none rounded-b-lg"></div>
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none rounded-l-lg"></div>
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none rounded-r-lg"></div>

            {/* Court Page Content */}
            <div className="court-page relative z-10 bg-white min-h-[11in] p-16 rounded-lg">
              <ChecklistHeader />

              <ProgressSummary
                completedCount={progress.completedCount}
                inProgressCount={progress.inProgressCount}
                pendingCount={progress.pendingCount}
                totalCount={progress.totalCount}
                progressPercentage={progress.progressPercentage}
              />

              {isEditing ? (
                <div className="court-calculation mb-12">
                  <ChecklistEditor
                    markdownContent={markdownContent}
                    onChange={setMarkdownContent}
                    onSave={() => setIsEditing(false)}
                    onReset={resetToTemplate}
                  />
                </div>
              ) : (
                <ChecklistItemsList
                  items={checklistItems}
                  showCompleted={showCompleted}
                  onToggleItem={toggleItemStatus}
                  onToggleCompleted={() => setShowCompleted(!showCompleted)}
                  isEditing={isEditing}
                  onToggleEdit={() => setIsEditing(!isEditing)}
                />
              )}

              <RenderedChecklist markdownContent={markdownContent} />

              <CourtFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FL320ChecklistPage;
