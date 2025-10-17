"use client";

import React, { useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle2, GitCompare } from 'lucide-react';

export type TabType = 'petitioner' | 'respondent' | 'comparison';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  const tabs = [
    { id: 'petitioner' as TabType, label: "Petitioner's Proposal", icon: AlertCircle, colorClass: 'bg-red-50 text-red-700 border-red-500' },
    { id: 'respondent' as TabType, label: "Respondent's Proposal", icon: CheckCircle2, colorClass: 'bg-blue-50 text-blue-700 border-blue-500' },
    { id: 'comparison' as TabType, label: 'Side-by-Side Comparison', icon: GitCompare, colorClass: 'bg-purple-50 text-purple-700 border-purple-500' }
  ];

  // Auto-focus active tab for keyboard navigation
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab]?.focus();
    }
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent, currentTab: TabType) => {
    const currentIndex = tabs.findIndex(t => t.id === currentTab);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      onTabChange(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      onTabChange(tabs[prevIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onTabChange(tabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      onTabChange(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 no-print">
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        <div role="tablist" aria-label="RFO Comparison Views" className="flex">
          {tabs.map(({ id, label, icon: Icon, colorClass }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                ref={el => { tabRefs.current[id] = el; }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${id}-tabpanel`}
                id={`${id}-tab`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(id)}
                onKeyDown={(e) => handleKeyDown(e, id)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? `${colorClass} border-b-2`
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
