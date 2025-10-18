/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useRef } from 'react';
import PrintControls from './components/PrintControls';
import CoverPage from './components/CoverPage';
import TableOfContents from './components/TableOfContents';
import RespondentDeclaration from './components/RespondentDeclaration';
import TomRotertDeclaration from './components/TomRotertDeclaration';
import MemorandumOfPointsAndAuthorities from './components/MemorandumOfPointsAndAuthorities';
import ExhibitDEmailCommunications from './exhibits/Exhibit_D_Email_Communications';
import { legalDocumentStyles } from './styles/legal-document';

/**
 * Opposition Filing Page Component
 *
 * This is the main orchestrator component for the opposition filing document.
 * It composes all the sections and handles print functionality.
 *
 * Structure:
 * - Print Controls (fixed position)
 * - Cover Page
 * - Table of Contents
 * - Respondent's Declaration (Sections 1-14)
 * - Tom Rotert Declaration
 * - Memorandum of Points and Authorities
 * - Exhibits
 */
const OppositionFilingPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenComparison = () => {
    window.open('/rfo-comparison', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls */}
      <PrintControls onPrint={handlePrint} onOpenComparison={handleOpenComparison} />

      {/* Court Filing Document */}
      <div ref={printRef} className="legal-document min-h-screen bg-gray-50 py-8">
        <CoverPage />
        <TableOfContents />
        <RespondentDeclaration />
        <TomRotertDeclaration />
        <MemorandumOfPointsAndAuthorities />
        <ExhibitDEmailCommunications />
      </div>

      {/* Dual-Format Styles: Beautiful Web UI + California Rules of Court Print */}
      <style jsx>{legalDocumentStyles}</style>
    </div>
  );
};

export default OppositionFilingPage;
