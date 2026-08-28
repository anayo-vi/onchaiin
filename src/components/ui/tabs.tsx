import React from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex space-x-1 rounded-xl bg-[#1E2026] p-1.5 border border-[#2B2F36]',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex-1 flex items-center justify-center space-x-2 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer',
              isActive
                ? 'gradient-bg-purple text-[#0B0E11] font-bold shadow-md shadow-[#FCD535]/25'
                : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/50'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px]',
                  isActive
                    ? 'bg-[#0B0E11]/20 text-[#0B0E11]'
                    : 'bg-[#2B2F36] text-[#848E9C]'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
