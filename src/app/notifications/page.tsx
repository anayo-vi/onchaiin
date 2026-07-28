'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Check, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PROFIT' | 'LOSS'>('ALL');
  const [notifications, setNotifications] = useState([
    {
      id: 'inv-1',
      title: 'Stock Market Surge (+10.0% Profit)',
      message: 'Your stock market portfolio assets rose by +10.0% today, delivering an investment gain of +$7,000,000.00 USD.',
      type: 'PROFIT',
      isRead: false,
      date: 'Today, 14:12',
      gainLossText: '+10.0% Profit',
      amountText: '+$7,000,000.00 USD',
    },
    {
      id: 'inv-2',
      title: 'Tech Sector Earnings Rally (+7.5% Profit)',
      message: 'Tech index holdings surged +7.5% in afternoon trading, increasing portfolio equity value.',
      type: 'PROFIT',
      isRead: false,
      date: 'Today, 11:30',
      gainLossText: '+7.5% Profit',
      amountText: '+$5,250,000.00 USD',
    },
    {
      id: 'inv-3',
      title: 'Market Index Pullback (-2.5% Loss)',
      message: 'Stock market indices experienced a minor -2.5% market correction during morning trading session.',
      type: 'LOSS',
      isRead: false,
      date: 'Yesterday, 16:45',
      gainLossText: '-2.5% Loss',
      amountText: '-$1,750,000.00 USD',
    },
    {
      id: 'inv-4',
      title: 'Crypto Market Correction (-1.8% Loss)',
      message: 'Digital crypto assets dipped by -1.8% in response to short-term market consolidation.',
      type: 'LOSS',
      isRead: true,
      date: 'Yesterday, 09:15',
      gainLossText: '-1.8% Loss',
      amountText: '-$1,260,000.00 USD',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'PROFIT') return n.type === 'PROFIT';
    if (filter === 'LOSS') return n.type === 'LOSS';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Investment Updates & Flow</h1>
          <p className="text-xs text-slate-400">Real-time asset profit gains and market loss notifications</p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={<Check className="w-4 h-4" />}>
          Mark All Read
        </Button>
      </div>

      {/* Filter Tabs (All, Profit Updates, Loss Updates) */}
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL'
              ? 'gradient-bg-blue text-[#0B1220] shadow-md'
              : 'bg-[#111A2E] text-slate-300 hover:bg-[#1C2B4A]'
          }`}
        >
          All Updates ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('PROFIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            filter === 'PROFIT'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400/80 hover:bg-emerald-500/20'
          }`}
        >
          Profit Updates (Green)
        </button>

        <button
          onClick={() => setFilter('LOSS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            filter === 'LOSS'
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-md'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400/80 hover:bg-rose-500/20'
          }`}
        >
          Loss Updates (Red)
        </button>
      </div>

      <Card className="p-6 border-slate-800 space-y-4 bg-[#111A2E]/90 backdrop-blur-2xl">
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex items-start space-x-4 ${
                n.type === 'PROFIT'
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/5'
              }`}
            >
              {/* Profit / Loss Icon Badge */}
              <div
                className={`p-3 rounded-2xl font-bold mt-0.5 shrink-0 ${
                  n.type === 'PROFIT'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                }`}
              >
                {n.type === 'PROFIT' ? (
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-rose-400" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <span>{n.title}</span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border ${
                        n.type === 'PROFIT'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      }`}
                    >
                      {n.gainLossText}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {n.message}
                </p>

                <div className="pt-1 flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">Impact:</span>
                  <span
                    className={`font-mono font-bold ${
                      n.type === 'PROFIT' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {n.amountText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
