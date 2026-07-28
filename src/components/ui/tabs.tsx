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
        'flex space-x-1 rounded-xl bg-slate-900/80 p-1.5 border border-slate-800',
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
                ? 'gradient-bg-purple text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px]',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-400'
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
