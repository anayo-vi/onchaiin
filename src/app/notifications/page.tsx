'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, Gift, ShieldAlert, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Gift Card Trade Approved!',
      message: 'Your $500 Apple Gift Card trade was approved. 425.00 USDT added to your wallet balance.',
      type: 'GIFT_CARD',
      isRead: false,
      date: 'Today, 14:12',
    },
    {
      id: '2',
      title: 'Deposit Confirmed',
      message: 'Your deposit of 1,000 USDT TRC20 is now available for trading.',
      type: 'TRANSACTION',
      isRead: false,
      date: 'Yesterday, 09:15',
    },
    {
      id: '3',
      title: 'Welcome to OnChaiin Platform',
      message: 'Complete your KYC identity verification to unlock higher withdrawal tiers.',
      type: 'SYSTEM',
      isRead: true,
      date: '24 Jul 2026',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications Center</h1>
          <p className="text-xs text-slate-400">Security alerts, transaction confirmations, and gift card status updates</p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={<Check className="w-4 h-4" />}>
          Mark All Read
        </Button>
      </div>

      <Card className="p-6 border-slate-800 space-y-4">
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-colors flex items-start space-x-4 ${
                n.isRead
                  ? 'bg-slate-900/40 border-slate-800/60'
                  : 'bg-purple-950/20 border-purple-500/40'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 mt-0.5">
                {n.type === 'GIFT_CARD' ? <Gift className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
