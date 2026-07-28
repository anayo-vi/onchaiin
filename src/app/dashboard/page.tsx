'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [avatarUrl, setAvatarUrl] = useState<string>('/profile-pic.jpeg');

  // Real-time Avatar Sync across all components
  useEffect(() => {
    const syncAvatar = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('user_avatar') : null;
      if (stored) {
        setAvatarUrl(stored);
      } else if (user?.avatar) {
        setAvatarUrl(user.avatar);
      }
    };

    syncAvatar();
    window.addEventListener('storage', syncAvatar);
    return () => window.removeEventListener('storage', syncAvatar);
  }, [user?.avatar]);

  // Real-time market movers watchlist data
  const marketMovers = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$78,107.50',
      change: '-0.8%',
      isUp: false,
      icon: '₿',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/30',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$3,480.12',
      change: '+2.4%',
      isUp: true,
      icon: 'Ξ',
      iconBg: 'bg-indigo-500 text-white shadow-indigo-500/30',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      price: '$1.00',
      change: '0.0%',
      isUp: true,
      icon: '💲',
      iconBg: 'bg-emerald-500 text-white shadow-emerald-500/30',
    },
    {
      name: 'TRON',
      symbol: 'TRX',
      price: '$0.245',
      change: '+5.6%',
      isUp: true,
      icon: '🔴',
      iconBg: 'bg-rose-500 text-white shadow-rose-500/30',
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      price: '$112.80',
      change: '-0.4%',
      isUp: false,
      icon: 'Ł',
      iconBg: 'bg-sky-500 text-white shadow-sky-500/30',
    },
  ];

  const transactions = [
    {
      id: 'tx-1',
      title: 'Apple $500 Gift Card Payout',
      amount: '+ 425.00 USDT',
      date: 'Today, 14:32',
      status: 'COMPLETED',
      icon: Gift,
      iconBg: 'bg-[#6EB7FF]/20 text-[#6EB7FF]',
    },
    {
      id: 'tx-2',
      title: 'TRC20 Wallet Deposit',
      amount: '+ 1,000.00 USDT',
      date: 'Yesterday, 09:15',
      status: 'COMPLETED',
      icon: ArrowDownLeft,
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      id: 'tx-3',
      title: 'External Bitcoin Payout',
      amount: '- 0.05 BTC',
      date: '24 Jul 2026',
      status: 'COMPLETED',
      icon: ArrowUpRight,
      iconBg: 'bg-amber-500/20 text-amber-400',
    },
  ];

  return (
    <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl px-4 py-6 space-y-6">
      {/* 1. Header Profile Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3.5">
          <img
            src={avatarUrl}
            alt={user?.name || 'Leo Garcia Arthur'}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#6EB7FF]/50 shadow-xl"
          />
          <div>
            <p className="text-xs text-slate-400 font-medium">Welcome back</p>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {user?.name || 'Leo Garcia Arthur'}
            </h1>
          </div>
        </div>

        <Badge variant="success" size="md" className="py-1.5 px-3.5 bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold rounded-full">
          <CheckCircle2 className="w-4 h-4 mr-1.5 inline-block text-emerald-400 fill-emerald-500/20" />
          Verified
        </Badge>
      </div>

      {/* 2. Total Balance Card */}
      <Card glow className="p-6 sm:p-7 border-slate-800 bg-[#111A2E]/90 backdrop-blur-2xl rounded-3xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#6EB7FF]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">TOTAL BALANCE</p>
          <div className="flex items-baseline space-x-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              $70,482,914.37
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              +7.5%
            </span>
          </div>
        </div>

        {/* Available & Pending Status Pills Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Available Pill */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/40 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Available</p>
            <p className="text-sm font-black text-emerald-400 uppercase tracking-wider">UNLOCKED</p>
          </div>

          {/* Pending Pill */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/40 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Pending</p>
            <p className="text-sm font-bold text-emerald-400 tracking-tight">No fees required</p>
          </div>
        </div>

        {/* Deposit & Withdraw Buttons */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          <Link href="/wallet/deposit" className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full py-3.5 text-sm font-extrabold gradient-bg-blue text-[#0B1220] rounded-2xl shadow-lg shadow-[#5A9BFF]/25"
            >
              Deposit
            </Button>
          </Link>
          <Link href="/wallet/withdraw" className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full py-3.5 text-sm font-extrabold gradient-bg-blue text-[#0B1220] rounded-2xl shadow-lg shadow-[#5A9BFF]/25"
            >
              Withdraw
            </Button>
          </Link>
        </div>
      </Card>

      {/* 3. Market Movers Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#6EB7FF]" />
            <span>Live Market Rates</span>
          </h3>
          <Link href="/trade" className="text-xs font-bold text-[#6EB7FF] hover:underline flex items-center">
            Trade Now <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {marketMovers.map((item) => (
            <Card key={item.symbol} hoverable className="p-3.5 border-slate-800 space-y-2 bg-[#111A2E]/80">
              <div className="flex items-center justify-between">
                <span className="text-base">{item.icon}</span>
                <span className={`text-[11px] font-bold ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.change}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">{item.symbol}</p>
                <p className="text-[11px] font-mono text-slate-300 font-bold">{item.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Recent Transactions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">Recent Activity</h3>
          <Link href="/wallet" className="text-xs font-bold text-[#6EB7FF] hover:underline">
            View All
          </Link>
        </div>

        <Card className="p-2 border-slate-800 divide-y divide-slate-800/60 bg-[#111A2E]/80">
          {transactions.map((tx) => {
            const Icon = tx.icon;
            return (
              <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-slate-800/30 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${tx.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{tx.title}</p>
                    <p className="text-[10px] text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-emerald-400">{tx.amount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{tx.status}</p>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
