'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  Gift,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Wallet,
  FileCheck,
  Bell,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  Eye,
  Settings
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export default function AdminOverviewPage() {
  // Live stats from database
  const [stats, setStats] = useState<any>({
    managedUsersCount: 0,
    totalFeesCollectedUSD: 0.0,
    pendingFeeCount: 0,
    pendingFeeValueUSD: 0.0,
    pendingKYCCount: 0,
    primaryUser: {
      name: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      balanceUSD: 0.0,
      kycStatus: 'UNVERIFIED',
      avatar: '/profile-pic.jpeg',
    },
  });
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Top Up Modal
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);

  // Deduct Charges Modal
  const [isDeductOpen, setIsDeductOpen] = useState(false);
  const [deductAmount, setDeductAmount] = useState('');
  const [deductReason, setDeductReason] = useState('Administrative Processing Fee');
  const [deductSuccess, setDeductSuccess] = useState(false);
  const [deductLoading, setDeductLoading] = useState(false);

  // Notification Modal
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState<'PROFIT' | 'SECURITY' | 'SYSTEM'>('PROFIT');
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  const fetchStats = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data?.success && data?.stats) {
        setStats((prev: any) => {
          const fetchedBal = data.stats.primaryUser?.balanceUSD;
          const prevBal = prev?.primaryUser?.balanceUSD;
          const finalBal = (fetchedBal !== undefined && fetchedBal > 0)
            ? fetchedBal
            : (prevBal !== undefined && prevBal > 0 ? prevBal : fetchedBal ?? 0);

          return {
            ...data.stats,
            primaryUser: {
              ...data.stats.primaryUser,
              balanceUSD: finalBal,
            },
          };
        });
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.warn('Admin stats fetch error:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(true);
    const interval = setInterval(() => fetchStats(false), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount) || 0;
    if (amount <= 0) return;
    setTopUpLoading(true);
    try {
      const res = await fetch('/api/admin/users/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: stats.primaryUser?.id,
          email: stats.primaryUser?.email || 'leogarcia39@onchaiin.com',
          amount,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setStats((prev: any) => ({
          ...prev,
          primaryUser: {
            ...prev.primaryUser,
            balanceUSD: data.newBalance,
          },
        }));
        setTopUpSuccess(true);
        setTimeout(() => {
          setTopUpSuccess(false);
          setIsTopUpOpen(false);
          setTopUpAmount('');
        }, 1800);
      }
    } catch (err) {
      console.warn('Top up error:', err);
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleDeductCharges = async () => {
    const amount = parseFloat(deductAmount) || 0;
    if (amount <= 0) return;
    setDeductLoading(true);
    try {
      const res = await fetch('/api/admin/users/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: stats.primaryUser?.id,
          email: stats.primaryUser?.email || 'leogarcia39@onchaiin.com',
          amount,
          reason: deductReason,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setStats((prev: any) => ({
          ...prev,
          primaryUser: {
            ...prev.primaryUser,
            balanceUSD: data.newBalance,
          },
        }));
        setDeductSuccess(true);
        setTimeout(() => {
          setDeductSuccess(false);
          setIsDeductOpen(false);
          setDeductAmount('');
        }, 1800);
      }
    } catch (err) {
      console.warn('Deduct charges error:', err);
    } finally {
      setDeductLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notifTitle || !notifMessage) return;
    setNotifLoading(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: stats.primaryUser?.id,
          title: notifTitle,
          message: notifMessage,
          category: notifCategory,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setNotifSuccess(true);
        setTimeout(() => {
          setNotifSuccess(false);
          setIsNotifOpen(false);
          setNotifTitle('');
          setNotifMessage('');
        }, 1800);
      }
    } catch (err) {
      console.warn('Notification send error:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  const kpis = [
    {
      title: 'Total Managed Users',
      value: loading ? '...' : `${stats.managedUsersCount}`,
      sub: 'Active accounts',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'User Account Balance',
      value: loading
        ? '...'
        : `$${(stats.primaryUser?.balanceUSD ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: 'USDT — Live from DB',
      icon: Wallet,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Pending Fee Submissions',
      value: loading ? '...' : `${stats.pendingFeeCount}`,
      sub: `$${(stats.pendingFeeValueUSD ?? 0).toFixed(2)} USD queued`,
      icon: Gift,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Pending KYC Queue',
      value: loading ? '...' : `${stats.pendingKYCCount}`,
      sub: 'Identity verifications',
      icon: FileCheck,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Executive Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time platform oversight — user ledger, fee submissions, KYC compliance
            {lastRefreshed && (
              <span className="ml-2 text-slate-500">
                · Updated {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchStats(true)}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-[#6EB7FF]/40 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-[#FCD535]/15 border-[#FCD535]/40 text-white">
            <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Platform Superuser
          </Badge>
        </div>
      </div>

      {/* KPI Tiles — Live from DB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} hoverable className="p-5 border-[#2B2F36] space-y-3 bg-[#181A20]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{kpi.title}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-xl font-black ${loading ? 'text-slate-500' : 'text-white'}`}>{kpi.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Administrative Fee Revenue Card */}
      <Card glow className="p-6 sm:p-7 border-[#2B2F36] bg-[#181A20]/90 backdrop-blur-2xl rounded-3xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6EB7FF]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total Administrative Fees Collected
            </span>
            <Badge variant="neutral" size="sm" className="bg-slate-800 border-slate-700 text-slate-300">
              Gift Card Payments
            </Badge>
          </div>

          <div className="flex items-baseline space-x-3 flex-wrap">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
              ${loading
                ? '—'
                : (stats.totalFeesCollectedUSD ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </h2>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
              Live · Updated on Approvals
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Pending Fee Submissions</span>
            <p className="text-sm font-black text-amber-400 tracking-tight">
              {loading ? '…' : `${stats.pendingFeeCount} submission(s) — $${(stats.pendingFeeValueUSD ?? 0).toFixed(2)} USD`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/30 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Pending KYC Reviews</span>
            <p className="text-sm font-black text-purple-400 tracking-tight">
              {loading ? '…' : `${stats.pendingKYCCount} document(s) awaiting review`}
            </p>
          </div>
        </div>
      </Card>

      {/* Primary Managed User Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card className="p-6 border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#6EB7FF]" />
                  <span>Primary Managed Account</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Direct ledger control, push notifications, KYC inspector</p>
              </div>
              <Link href="/admin/users" className="text-xs font-bold text-[#6EB7FF] hover:underline">
                View All Users
              </Link>
            </div>

            {/* User Profile Card */}
            <div className="p-5 rounded-2xl bg-[#1E2026] border border-[#2B2F36] flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <img
                  src={stats.primaryUser?.avatar || '/profile-pic.jpeg'}
                  alt={stats.primaryUser?.name || 'User'}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#6EB7FF]/50 shadow-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/profile-pic.jpeg';
                  }}
                />
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h4 className="text-sm font-black text-white">
                      {loading ? '…' : (stats.primaryUser?.name || 'User')}
                    </h4>
                    <Badge variant="success" size="sm">
                      {stats.primaryUser?.kycStatus === 'APPROVED' ? 'KYC Verified' : stats.primaryUser?.kycStatus || 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {stats.primaryUser?.phone || '—'} · {stats.primaryUser?.city || '—'}, {stats.primaryUser?.country || '—'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {stats.primaryUser?.email || '—'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 font-medium">USDT Balance</span>
                <p className="text-xl font-mono font-black text-emerald-400">
                  ${loading
                    ? '…'
                    : (stats.primaryUser?.balanceUSD ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="primary"
                size="md"
                className="gradient-bg-blue text-[#0B0E11] font-extrabold shadow-md"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsTopUpOpen(true)}
              >
                Top Up Balance
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 font-extrabold"
                leftIcon={<Minus className="w-4 h-4 text-rose-400" />}
                onClick={() => setIsDeductOpen(true)}
              >
                Deduct Charges
              </Button>

              <Button
                variant="outline"
                size="md"
                className="font-bold"
                leftIcon={<Bell className="w-4 h-4 text-[#6EB7FF]" />}
                onClick={() => setIsNotifOpen(true)}
              >
                Send Notification
              </Button>

              <Link href="/admin/kyc" className="block">
                <Button variant="outline" size="md" className="w-full font-bold" leftIcon={<Eye className="w-4 h-4 text-purple-400" />}>
                  Inspect KYC
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Admin Action Queue */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Administrative Queue</h3>
            <div className="space-y-3 text-xs">
              <Link
                href="/admin/gift-cards/submissions"
                className="p-3.5 rounded-xl bg-[#1E2026] border border-[#2B2F36] flex items-center justify-between hover:border-[#FCD535]/50 transition-all"
              >
                <div>
                  <p className="font-bold text-white flex items-center space-x-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gift Card Submissions</span>
                    {stats.pendingFeeCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-black text-[10px]">
                        {stats.pendingFeeCount}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Review & approve submitted gift cards</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6EB7FF]" />
              </Link>

              <Link
                href="/admin/kyc"
                className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between hover:border-emerald-500/50 transition-all"
              >
                <div>
                  <p className="font-bold text-white flex items-center space-x-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>KYC Documents</span>
                    {stats.pendingKYCCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-black text-[10px]">
                        {stats.pendingKYCCount}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Inspect passport & verification assets</p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </Link>

              <Link
                href="/admin/settings"
                className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between hover:border-amber-500/50 transition-all"
              >
                <div>
                  <p className="font-bold text-white flex items-center space-x-1.5">
                    <Settings className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fee Settings</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Configure withdrawal fee rules</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>

              <Link
                href="/admin/users"
                className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between hover:border-purple-500/50 transition-all"
              >
                <div>
                  <p className="font-bold text-white flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>User Registry</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage {stats.managedUsersCount} user account(s)</p>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Up Modal */}
      <Modal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} title={`Top Up Balance — ${stats.primaryUser?.name || 'User'}`}>
        <div className="space-y-4 text-xs">
          {topUpSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Successfully credited ${parseFloat(topUpAmount || '0').toLocaleString()} USD to{' '}
                {stats.primaryUser?.name || 'User'}!
              </span>
            </div>
          )}
          <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 space-y-1">
            <span className="text-slate-400">Current Balance:</span>
            <p className="text-lg font-mono font-black text-emerald-400">
              ${(stats.primaryUser?.balanceUSD ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </p>
          </div>
          <Input
            label="Credit Amount ($ USD)"
            type="number"
            placeholder="e.g. 10000.00"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            leftIcon={<DollarSign className="w-4 h-4 text-[#6EB7FF]" />}
            required
          />
          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsTopUpOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
              disabled={!topUpAmount || topUpLoading}
              onClick={handleTopUp}
            >
              {topUpLoading ? 'Processing…' : 'Execute Top Up'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deduct Charges Modal */}
      <Modal isOpen={isDeductOpen} onClose={() => setIsDeductOpen(false)} title={`Deduct Charges — ${stats.primaryUser?.name || 'User'}`}>
        <div className="space-y-4 text-xs">
          {deductSuccess && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center space-x-2 text-rose-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Successfully debited -${parseFloat(deductAmount || '0').toLocaleString()} USD from {stats.primaryUser?.name || 'User'}'s account!</span>
            </div>
          )}
          <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 space-y-1">
            <span className="text-slate-400">Current USDT Balance:</span>
            <p className="text-xl font-mono font-black text-emerald-400">
              ${(stats.primaryUser?.balanceUSD ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </p>
          </div>
          <Input
            label="Deduction Charge Amount ($ USD)"
            type="number"
            placeholder="e.g. 2500.00"
            value={deductAmount}
            onChange={(e) => setDeductAmount(e.target.value)}
            leftIcon={<DollarSign className="w-4 h-4 text-rose-400" />}
            required
          />
          <Input
            label="Deduction Reason / Description"
            type="text"
            placeholder="e.g. Administrative Processing Fee"
            value={deductReason}
            onChange={(e) => setDeductReason(e.target.value)}
            required
          />
          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsDeductOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              className="flex-1 font-bold"
              disabled={!deductAmount || deductLoading}
              onClick={handleDeductCharges}
            >
              {deductLoading ? 'Deducting…' : 'Execute Deduction'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notification Modal */}
      <Modal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} title={`Send Notification — ${stats.primaryUser?.name || 'User'}`}>
        <div className="space-y-4 text-xs">
          {notifSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Notification dispatched to {stats.primaryUser?.name || 'User'}'s inbox!</span>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Notification Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PROFIT', 'SECURITY', 'SYSTEM'] as const).map((cat) => {
                const colors: Record<string, string> = {
                  PROFIT: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
                  SECURITY: 'bg-amber-500/20 border-amber-500 text-amber-400',
                  SYSTEM: 'bg-purple-500/20 border-purple-500 text-purple-400',
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNotifCategory(cat)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      notifCategory === cat ? colors[cat] : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {cat === 'PROFIT' ? 'Profit (+%)' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
          <Input
            label="Notification Title"
            type="text"
            placeholder="e.g. Assets Rose 10% — Profits Credited"
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Message Content</label>
            <textarea
              rows={3}
              placeholder="e.g. Your portfolio rose 10% today — profits have been credited to your USDT wallet."
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              className="w-full bg-[#1E2026] border border-[#2B2F36] rounded-xl p-3 text-xs text-white placeholder:text-[#848E9C] focus:outline-none focus:border-[#FCD535]"
              required
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsNotifOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
              disabled={!notifTitle || !notifMessage || notifLoading}
              onClick={handleSendNotification}
            >
              {notifLoading ? 'Sending…' : 'Send Notification'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
