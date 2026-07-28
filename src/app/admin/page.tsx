'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Gift, 
  ArrowUpRight, 
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Wallet,
  Building,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminOverviewPage() {
  // Administrative fee collection balance (starts at $0.00 USD, updated when users submit Apple Gift Card fee)
  const [feeCollectedUSD, setFeeCollectedUSD] = useState(0.00);

  const kpis = [
    { title: 'Total Managed Users', value: '1 Active', change: 'Leo Garcia Arthur', icon: Users, color: 'text-purple-400' },
    { title: 'User Account Balance', value: '$70,482,914.37', change: 'Unlocked & Active', icon: Wallet, color: 'text-emerald-400' },
    { title: 'Withdrawal Fee Rule', value: '$2,500.00 USD', change: 'Apple Gift Card Required', icon: Gift, color: 'text-amber-400' },
    { title: 'Pending Fee Verification', value: '1 Queue', change: 'Apple Card Upload', icon: ArrowUpRight, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Executive Control Dashboard</h1>
          <p className="text-xs text-slate-400">Platform administrative fees, user management, and compliance verification</p>
        </div>

        <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-amber-500/15 border-amber-500/40 text-amber-400">
          <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Platform Superuser Mode
        </Badge>
      </div>

      {/* Administrative Revenue / Withdrawal Fee Collected Card (No Deposit/Withdraw buttons) */}
      <Card glow className="p-6 sm:p-7 border-slate-800 bg-[#111A2E]/90 backdrop-blur-2xl rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6EB7FF]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total Administrative Withdrawal Fees Collected
            </span>
            <Badge variant="neutral" size="sm" className="bg-slate-800 border-slate-700 text-slate-300">
              Apple Gift Card Payments
            </Badge>
          </div>

          <div className="flex items-baseline space-x-3 flex-wrap">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
              ${feeCollectedUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </h2>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
              Updated on Fee Submissions
            </span>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Administrative revenue accumulates automatically when users submit their $2,500.00 USD Apple Gift Card fee to process payouts.
          </p>
        </div>

        {/* Status Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Pending Withdrawal Fee Uploads</span>
            <p className="text-sm font-black text-amber-400 tracking-tight">1 Submission ($2,500.00 USD Queue)</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Fee Enforcement Status</span>
            <p className="text-sm font-black text-emerald-400 tracking-tight">ACTIVE ($2,500 Apple Gift Card)</p>
          </div>
        </div>
      </Card>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} hoverable className="p-5 border-slate-800 space-y-3 bg-[#111A2E]/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xl font-black text-white">{kpi.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpi.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Required Queue & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Managed Users Overview */}
        <div className="lg:col-span-7">
          <Card className="p-6 border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#6EB7FF]" />
                <span>Primary Managed Account</span>
              </h3>
              <Link href="/admin/users" className="text-xs font-bold text-[#6EB7FF] hover:underline">
                View All Users
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <img
                  src="/profile-pic.jpeg"
                  alt="Leo Garcia Arthur"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6EB7FF]/40"
                />
                <div>
                  <p className="text-sm font-extrabold text-white">Leo Garcia Arthur</p>
                  <p className="text-xs text-slate-400 font-mono">+1 (505) 730-8886 • New Mexico, US</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-mono font-black text-emerald-400">$70,482,914.37 USD</p>
                <Badge variant="success" size="sm">KYC Verified</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link href="/admin/users" className="block">
                <Button variant="primary" size="md" className="w-full font-bold gradient-bg-blue text-[#0B1220]">
                  Top Up Balance
                </Button>
              </Link>
              <Link href="/admin/users" className="block">
                <Button variant="outline" size="md" className="w-full font-bold">
                  Send Notification
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Action Required Queue */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Administrative Queue</h3>
            <div className="space-y-3 text-xs">
              <Link href="/admin/kyc" className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between hover:border-[#6EB7FF]/50 transition-all block">
                <div>
                  <p className="font-bold text-white">Verify Fee Gift Card Uploads</p>
                  <p className="text-[11px] text-slate-400">Inspect front & back images ($2,500 Fee)</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6EB7FF]" />
              </Link>

              <Link href="/admin/kyc" className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between hover:border-emerald-500/50 transition-all block">
                <div>
                  <p className="font-bold text-white">Inspect User KYC Documents</p>
                  <p className="text-[11px] text-slate-400">Download passport & verification photos</p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </Link>

              <Link href="/admin/settings" className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between hover:border-amber-500/50 transition-all block">
                <div>
                  <p className="font-bold text-white">Withdrawal Fee Configuration</p>
                  <p className="text-[11px] text-slate-400">Manage $2,500 Apple Gift Card parameters</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
