"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, DollarSign, FileText, BarChart } from 'lucide-react';
import { SECTIONS, CASE_INFO } from '../constants';

interface CaseNavigationProps {
  onSectionClick: (sectionId: string) => void;
}

export const CaseNavigation = React.memo<CaseNavigationProps>(({ onSectionClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-slate-900">Case {CASE_INFO.caseNumber}</h1>

            <div className="hidden md:flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionClick(SECTIONS.OVERVIEW)}
                className="text-slate-700 hover:text-blue-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionClick(SECTIONS.FINANCIAL)}
                className="text-slate-700 hover:text-blue-600"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Financial
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionClick(SECTIONS.LEGAL_DOCS)}
                className="text-slate-700 hover:text-blue-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Legal Docs
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionClick(SECTIONS.ANALYTICS)}
                className="text-slate-700 hover:text-blue-600"
              >
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          <Button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Print Case File
          </Button>
        </div>
      </div>
    </nav>
  );
});

CaseNavigation.displayName = 'CaseNavigation';
