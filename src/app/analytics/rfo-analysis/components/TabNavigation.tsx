import React from 'react';
import { TAB_CONFIG } from '../constants';
import { TabId } from '../types';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export const TabNavigation = React.memo<TabNavigationProps>(({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
TabNavigation.displayName = 'TabNavigation';
