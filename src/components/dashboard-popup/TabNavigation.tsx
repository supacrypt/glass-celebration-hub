import React from 'react';
import { TabItem } from './types';

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-5 border-b border-[#a39b92]/20 pb-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#2d3f51]'
                : 'text-[#7a736b] hover:text-[#5a5651]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-[#2d3f51]" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;