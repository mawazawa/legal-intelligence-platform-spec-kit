/**
 * Tab Navigation Component
 * Displays tabs for switching between calculation views
 */

import React from 'react';
import { Calculator, GitCompare, Scale, type LucideIcon } from 'lucide-react';

export type TabType = 'calculation' | 'comparison' | 'declarations';

interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: Tab[] = [
  { id: 'calculation', label: 'Final Distribution Calculation', icon: Calculator },
  { id: 'comparison', label: 'Side-by-Side Comparison', icon: GitCompare },
  { id: 'declarations', label: 'Court Declarations', icon: Scale }
];

export const TabNavigation: React.FC<TabNavigationProps> = React.memo(({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 pt-4 pb-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';
