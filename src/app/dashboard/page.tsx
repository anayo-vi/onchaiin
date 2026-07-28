'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  const [avatarUrl, setAvatarUrl] = useState<string>('/profile-pic.jpeg');
  const [userBalance, setUserBalance] = useState<number>(0.0);
  const [userWallets, setUserWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Real-time Avatar Sync
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

  // Redirect admin users directly to /admin where their proper dashboard lives
  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      router.replace('/admin');
    }
  }, [status, isAdmin, router]);

  // Fetch user profile, wallets, and recent transactions from DB
  useEffect(() => {
    if (status !== 'authenticated' || isAdmin) return;
    async function fetchProfile() {
      setLoadingProfile(true);
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data?.success && data?.user) {
          const u = data.user;
          // Update avatar from DB
          if (u.avatar) {
            setAvatarUrl(u.avatar);
          }
          // Compute total USDT balance
          if (u.wallets) {
            setUserWallets(u.wallets);
            const usdtWallet = u.wallets.find((w: any) => w.currency === 'USDT');
            if (usdtWallet?.balance !== undefined) {
              setUserBalance(usdtWallet.balance);
            }
          }
        }
      } catch (err) {
        console.warn('User profile fetch error:', err);
      } finally {
        setLoadingProfile(false);
      }
    }

    async function fetchTransactions() {
      try {
        const res = await fetch('/api/wallets');
        const data = await res.json();
        if (data?.wallets) {
          // Flatten all wallet transactions across wallets, sorted newest first
          const allTxs: any[] = [];
          data.wallets.forEach((wallet: any) => {
            if (wallet.transactions) {
              wallet.transactions.forEach((tx: any) => {
                allTxs.push({ ...tx, walletCurrency: wallet.currency });
              });
            }
          });
          allTxs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setTransactions(allTxs.slice(0, 8));
        }
      } catch (err) {
        console.warn('Wallets fetch error:', err);
      }
    }

    fetchProfile();
    fetchTransactions();
  }, [status, isAdmin]);

  // Market movers (static display prices — not a live feed)
  const marketMovers = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$78,107.50', change: '-0.8%', isUp: false, icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', price: '$3,480.12', change: '+2.4%', isUp: true, icon: 'Ξ' },
    { name: 'Tether USD', symbol: 'USDT', price: '$1.00', change: '0.0%', isUp: true, icon: '💲' },
    { name: 'TRON', symbol: 'TRX', price: '$0.245', change: '+5.6%', isUp: true, icon: '🔴' },
    { name: 'Litecoin', symbol: 'LTC', price: '$112.80', change: '-0.4%', isUp: false, icon: 'Ł' },
  ];

  // Tx type display helpers
  const getTxIcon = (type: string) => {
    if (type === 'CREDIT' || type === 'DEPOSIT' || type === 'GIFT_CARD_PAYOUT') return ArrowDownLeft;
    return ArrowUpRight;
  };
  const getTxIconBg = (type: string) => {
    if (type === 'CREDIT' || type === 'DEPOSIT' || type === 'GIFT_CARD_PAYOUT')
      return 'bg-emerald-500/20 text-emerald-400';
    return 'bg-rose-500/20 text-rose-400';
  };
  const getTxAmount = (tx: any) => {
    const sign = ['CREDIT', 'DEPOSIT', 'GIFT_CARD_PAYOUT'].includes(tx.type) ? '+' : '-';
    return `${sign} ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${tx.walletCurrency || tx.currency}`;
  };
  const getTxAmountColor = (type: string) => {
    if (type === 'CREDIT' || type === 'DEPOSIT' || type === 'GIFT_CARD_PAYOUT') return 'text-emerald-400';
    return 'text-rose-400';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Show nothing while redirecting admin
  if (status === 'loading' || (status === 'authenticated' && isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-[#6EB7FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading your dashboard…</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // STANDARD USER DASHBOARD VIEW
  // -------------------------------------------------------
  return (
    <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl px-4 py-6 space-y-6">
      {/* 1. Header Profile Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3.5">
          <img
            src={avatarUrl}
            alt={user?.name || 'User'}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#6EB7FF]/50 shadow-xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/profile-pic.jpeg';
            }}
          />
          <div>
            <p className="text-xs text-slate-400 font-medium">Welcome back</p>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {user?.name || 'User'}
            </h1>
          </div>
        </div>

        <Badge
          variant="success"
          size="md"
          className="py-1.5 px-3.5 bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold rounded-full"
        >
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
              {loadingProfile
                ? <span className="text-slate-500">Loading…</span>
                : `$${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            </h2>
            {!loadingProfile && userBalance > 0 && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                USDT
              </span>
            )}
          </div>
        </div>

        {/* Status Pill */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/40 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Available</p>
          <p className="text-sm font-black text-emerald-400 uppercase tracking-wider">UNLOCKED</p>
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

      {/* 3. Wallet Breakdown */}
      {userWallets.length > 0 && !loadingProfile && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-[#6EB7FF]" />
              <span>My Wallets</span>
            </h3>
            <Link href="/wallet" className="text-xs font-bold text-[#6EB7FF] hover:underline flex items-center">
              Full Wallet <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {userWallets.map((wallet) => (
              <Card key={wallet.id} hoverable className="p-3.5 border-slate-800 space-y-2 bg-[#111A2E]/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#6EB7FF]">{wallet.currency}</span>
                  <Wallet className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white">
                    {wallet.balance.toLocaleString('en-US', {
                      minimumFractionDigits: wallet.currency === 'USDT' ? 2 : 6,
                      maximumFractionDigits: wallet.currency === 'USDT' ? 2 : 6,
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. Market Movers Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#6EB7FF]" />
            <span>Live Market Rates</span>
          </h3>
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

      {/* 5. Recent Activity (real from DB) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">Recent Activity</h3>
          <Link href="/wallet" className="text-xs font-bold text-[#6EB7FF] hover:underline">
            View All
          </Link>
        </div>

        <Card className="p-2 border-slate-800 divide-y divide-slate-800/60 bg-[#111A2E]/80">
          {loadingProfile ? (
            <div className="p-6 text-center text-slate-500 text-xs">Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <Gift className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs text-slate-500 font-medium">No transactions yet</p>
              <p className="text-[11px] text-slate-600">Your activity will appear here once you make a deposit or gift card submission.</p>
            </div>
          ) : (
            transactions.map((tx) => {
              const Icon = getTxIcon(tx.type);
              return (
                <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-slate-800/30 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${getTxIconBg(tx.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.description || tx.type}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-mono font-bold ${getTxAmountColor(tx.type)}`}>
                      {getTxAmount(tx)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">{tx.status}</p>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
