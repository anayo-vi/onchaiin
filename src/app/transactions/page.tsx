'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Wallet,
  DollarSign,
  ReceiptText,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Types ───────────────────────────────────────────────────────────────────
type TxStatus = 'PENDING' | 'COMPLETED' | 'APPROVED' | 'REJECTED' | 'FAILED' | 'CANCELLED' | 'PROCESSING' | 'CONFIRMED';
type TxCategory = 'ALL' | 'WALLET' | 'WITHDRAWAL' | 'DEPOSIT' | 'GIFT_CARD';
type TxFilter = 'ALL' | 'APPROVED' | 'REJECTED' | 'PENDING';

interface Transaction {
  id: string;
  category: string;
  type: string;
  description: string;
  amount: number;
  currency: string;
  fee?: number;
  netAmount?: number;
  calculatedPayout?: number;
  status: TxStatus;
  reference: string;
  createdAt: string;
  meta: Record<string, any>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  COMPLETED: { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40', icon: CheckCircle2 },
  APPROVED:  { label: 'Approved',  color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40', icon: CheckCircle2 },
  CONFIRMED: { label: 'Confirmed', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40', icon: CheckCircle2 },
  PENDING:   { label: 'Pending',   color: 'text-amber-400  bg-amber-500/15  border-amber-500/40',  icon: Clock         },
  PROCESSING:{ label: 'Processing',color: 'text-blue-400   bg-blue-500/15   border-blue-500/40',   icon: RefreshCw     },
  REJECTED:  { label: 'Rejected',  color: 'text-rose-400   bg-rose-500/15   border-rose-500/40',   icon: XCircle       },
  FAILED:    { label: 'Failed',    color: 'text-rose-400   bg-rose-500/15   border-rose-500/40',   icon: XCircle       },
  CANCELLED: { label: 'Cancelled', color: 'text-slate-400  bg-slate-500/15  border-slate-500/40',  icon: AlertCircle   },
};

const CATEGORY_ICON: Record<string, React.ComponentType<any>> = {
  WALLET:     Wallet,
  WITHDRAWAL: ArrowUpRight,
  DEPOSIT:    ArrowDownLeft,
  GIFT_CARD:  Gift,
};

const CATEGORY_COLOR: Record<string, string> = {
  WALLET:     'bg-[#6EB7FF]/20 text-[#6EB7FF]',
  WITHDRAWAL: 'bg-rose-500/20 text-rose-400',
  DEPOSIT:    'bg-emerald-500/20 text-emerald-400',
  GIFT_CARD:  'bg-amber-500/20 text-amber-400',
};

function isApproved(status: string) {
  return ['COMPLETED', 'APPROVED', 'CONFIRMED'].includes(status);
}
function isRejected(status: string) {
  return ['REJECTED', 'FAILED', 'CANCELLED'].includes(status);
}
function isPending(status: string) {
  return ['PENDING', 'PROCESSING'].includes(status);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function truncate(str: string, n = 20) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, 8) + '…' + str.slice(-6) : str;
}

// ─── Expanded Detail Row ──────────────────────────────────────────────────────
function TxDetail({ tx }: { tx: Transaction }) {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rows: [string, React.ReactNode][] = [];

  rows.push(['Reference ID', (
    <span className="flex items-center space-x-1.5 font-mono">
      <span>{truncate(tx.reference, 28)}</span>
      <button onClick={() => copy(tx.reference)} className="text-[#6EB7FF] hover:text-white transition-colors">
        <Copy className="w-3 h-3" />
      </button>
    </span>
  )]);

  rows.push(['Category', tx.category.replace('_', ' ')]);
  rows.push(['Type', tx.type.replace(/_/g, ' ')]);

  if (tx.fee !== undefined && tx.fee > 0) {
    rows.push(['Network Fee', `${tx.fee.toFixed(6)} ${tx.currency}`]);
  }
  if (tx.netAmount !== undefined) {
    rows.push(['Net Amount', `${tx.netAmount.toFixed(2)} ${tx.currency}`]);
  }
  if (tx.calculatedPayout !== undefined) {
    rows.push(['Calculated Payout', `$${tx.calculatedPayout.toFixed(2)} USDT`]);
  }
  if (tx.meta?.destinationAddress) {
    rows.push(['Destination', (
      <span className="font-mono text-[11px]">{truncate(tx.meta.destinationAddress, 30)}</span>
    )]);
  }
  if (tx.meta?.txHash) {
    rows.push(['Tx Hash', (
      <span className="flex items-center space-x-1.5 font-mono text-[11px]">
        <span>{truncate(tx.meta.txHash, 28)}</span>
        <button onClick={() => copy(tx.meta.txHash)} className="text-[#6EB7FF] hover:text-white transition-colors">
          <Copy className="w-3 h-3" />
        </button>
      </span>
    )]);
  }
  if (tx.meta?.confirmations !== undefined) {
    rows.push(['Confirmations', `${tx.meta.confirmations} / 3`]);
  }
  if (tx.meta?.brand) {
    rows.push(['Gift Card Brand', tx.meta.brand]);
    rows.push(['Denomination', `$${tx.meta.denomination}`]);
    rows.push(['Rate', `${tx.meta.ratePercentage}%`]);
    rows.push(['Card Type', tx.meta.cardType]);
  }
  if (tx.meta?.rejectionReason) {
    rows.push(['Rejection Reason', (
      <span className="text-rose-300">{tx.meta.rejectionReason}</span>
    )]);
  }
  if (tx.meta?.adminNotes) {
    rows.push(['Admin Notes', tx.meta.adminNotes]);
  }

  return (
    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-[#0B1220]/60 rounded-b-2xl">
      {copied && (
        <div className="mb-2 text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3" /> <span>Copied to clipboard</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
        {rows.map(([label, value]) => (
          <div key={label as string} className="space-y-0.5">
            <p className="text-slate-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-slate-200 font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Gift card image preview */}
      {tx.meta?.frontImageUrl && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">Gift Card Image</p>
          <img
            src={tx.meta.frontImageUrl}
            alt="Gift Card"
            className="h-24 rounded-xl object-cover border border-slate-700"
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TxCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<TxFilter>('ALL');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data?.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.warn('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Category filter
      if (categoryFilter !== 'ALL' && tx.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter === 'APPROVED' && !isApproved(tx.status)) return false;
      if (statusFilter === 'REJECTED' && !isRejected(tx.status)) return false;
      if (statusFilter === 'PENDING' && !isPending(tx.status)) return false;

      // Search
      if (search) {
        const q = search.toLowerCase();
        return (
          tx.description.toLowerCase().includes(q) ||
          tx.reference.toLowerCase().includes(q) ||
          tx.currency.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, categoryFilter, statusFilter, search]);

  // Summary counts
  const counts = useMemo(() => ({
    total: transactions.length,
    approved: transactions.filter((t) => isApproved(t.status)).length,
    rejected: transactions.filter((t) => isRejected(t.status)).length,
    pending:  transactions.filter((t) => isPending(t.status)).length,
  }), [transactions]);

  const CATEGORIES: { key: TxCategory; label: string }[] = [
    { key: 'ALL', label: 'All Types' },
    { key: 'WALLET', label: 'Ledger' },
    { key: 'DEPOSIT', label: 'Deposits' },
    { key: 'WITHDRAWAL', label: 'Withdrawals' },
    { key: 'GIFT_CARD', label: 'Gift Cards' },
  ];

  const STATUS_FILTERS: { key: TxFilter; label: string; color: string }[] = [
    { key: 'ALL',      label: 'All Status', color: 'text-slate-300' },
    { key: 'APPROVED', label: 'Approved',   color: 'text-emerald-400' },
    { key: 'PENDING',  label: 'Pending',    color: 'text-amber-400' },
    { key: 'REJECTED', label: 'Rejected',   color: 'text-rose-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <ReceiptText className="w-6 h-6 text-[#6EB7FF]" />
            <span>Transaction History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            All your deposits, withdrawals, gift card submissions, and wallet activity
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-[#6EB7FF]/40 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.total, color: 'text-white', bg: 'border-slate-700' },
          { label: 'Approved', value: counts.approved, color: 'text-emerald-400', bg: 'border-emerald-500/30' },
          { label: 'Pending', value: counts.pending, color: 'text-amber-400', bg: 'border-amber-500/30' },
          { label: 'Rejected', value: counts.rejected, color: 'text-rose-400', bg: 'border-rose-500/30' },
        ].map((s) => (
          <Card key={s.label} className={`p-4 border ${s.bg} bg-[#111A2E]/80 text-center space-y-1`}>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>
              {loading ? '—' : s.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <Input
          placeholder="Search by description, reference, currency…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategoryFilter(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                categoryFilter === c.key
                  ? 'bg-[#6EB7FF]/20 border-[#6EB7FF]/60 text-[#6EB7FF]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {c.label}
            </button>
          ))}

          <div className="flex-1" />

          {/* Status Filter Pills */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  statusFilter === f.key
                    ? `${f.color} bg-slate-800 border-current`
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-800/40 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <Card className="p-12 border-slate-800 bg-[#111A2E]/80 text-center space-y-3">
            <ReceiptText className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-bold text-slate-400">No transactions found</p>
            <p className="text-xs text-slate-600">
              {search || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Your transaction history will appear here'}
            </p>
          </Card>
        ) : (
          filtered.map((tx) => {
            const statusInfo = STATUS_MAP[tx.status] || STATUS_MAP['PENDING'];
            const StatusIcon = statusInfo.icon;
            const CatIcon = CATEGORY_ICON[tx.category] || Wallet;
            const catColor = CATEGORY_COLOR[tx.category] || 'bg-slate-500/20 text-slate-400';
            const isExpanded = expandedId === tx.id;
            const isCredit = ['DEPOSIT', 'CREDIT', 'GIFT_CARD_PAYOUT'].includes(tx.type) ||
              (tx.category === 'GIFT_CARD' && isApproved(tx.status));

            return (
              <div
                key={tx.id}
                className="rounded-2xl border border-slate-800 bg-[#111A2E]/80 overflow-hidden transition-all hover:border-slate-700"
              >
                {/* Main Row */}
                <button
                  className="w-full flex items-center space-x-4 p-4 text-left hover:bg-slate-800/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                >
                  {/* Category Icon */}
                  <div className={`p-2.5 rounded-xl shrink-0 ${catColor}`}>
                    <CatIcon className="w-4 h-4" />
                  </div>

                  {/* Description & Date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{tx.description}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(tx.createdAt)}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-mono font-black ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCredit ? '+' : '-'}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {tx.currency}
                    </p>
                    {tx.calculatedPayout !== undefined && isApproved(tx.status) && (
                      <p className="text-[10px] text-emerald-300 font-mono">
                        → ${tx.calculatedPayout.toFixed(2)} USDT
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center space-x-2">
                    <span className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusInfo.label}</span>
                    </span>
                    {isExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    }
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && <TxDetail tx={tx} />}
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-center text-[11px] text-slate-600">
          Showing {filtered.length} of {transactions.length} transactions
        </p>
      )}
    </div>
  );
}
