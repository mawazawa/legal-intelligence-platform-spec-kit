'use client';

import React from 'react';
import { Scale, GitCompare, FileText, LucideIcon } from 'lucide-react';

export type OppositionTabType = 'petitioner-calc' | 'respondent-calc' | 'side-by-side';

interface Tab {
  id: OppositionTabType;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface TabNavigationProps {
  activeTab: OppositionTabType;
  onTabChange: (tab: OppositionTabType) => void;
}

const tabs: Tab[] = [
  {
    id: 'petitioner-calc',
    label: "Petitioner's Calculation",
    icon: FileText,
    description: 'Rosanna Alvero\'s claimed distribution'
  },
  {
    id: 'respondent-calc',
    label: "Respondent's Correct Calculation",
    icon: Scale,
    description: 'Mathieu Wauters\' correct distribution'
  },
  {
    id: 'side-by-side',
    label: 'Side-by-Side Comparison',
    icon: GitCompare,
    description: 'Line-by-line mathematical analysis'
  }
];

export default function OppositionTabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 pt-4 pb-2">
          {tabs.map(({ id, label, icon: Icon, description }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{label}</span>
                </div>
                <span className="text-xs text-slate-500 hidden lg:block">{description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
