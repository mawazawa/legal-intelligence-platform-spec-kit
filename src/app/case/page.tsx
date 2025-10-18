"use client";

import React from 'react';
import { CaseNavigation } from './components/CaseNavigation';
import { OverviewSection } from './components/OverviewSection';
import { FinancialSection } from './components/FinancialSection';
import { LegalDocsSection } from './components/LegalDocsSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { scrollToSection } from './utils';

const ConsolidatedCasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <CaseNavigation onSectionClick={scrollToSection} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <OverviewSection onCardClick={scrollToSection} />
        <FinancialSection />
        <LegalDocsSection />
        <AnalyticsSection />
      </div>

      <style jsx global>{`
        @media print {
          nav { display: none !important; }
          .no-print { display: none !important; }
          section { page-break-before: always; }
          section:first-of-type { page-break-before: avoid; }
        }
      `}</style>
    </div>
  );
};

export default ConsolidatedCasePage;
