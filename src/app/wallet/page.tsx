'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function WalletPage() {
  const [filterAsset, setFilterAsset] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const wallets = [
    { currency: 'USDT', balance: 3500.00, pending: 0.0, address: 'TR7LeoGarcia39UsdtAddress1234', usdValue: 3500.00, icon: '💲' },
    { currency: 'BTC', balance: 0.85, pending: 0.0, address: 'bc1qLeoGarcia39BtcAddress1234', usdValue: 81957.42, icon: '₿' },
    { currency: 'ETH', balance: 6.50, pending: 0.0, address: '0xLeoGarcia39EthAddress1234', usdValue: 22620.78, icon: 'Ξ' },
    { currency: 'TRX', balance: 12000.0, pending: 0.0, address: 'TLeoGarcia39TrxAddress1234', usdValue: 2940.00, icon: '🔴' },
    { currency: 'LTC', balance: 25.0, pending: 0.0, address: 'LTCLeoGarcia39LtcAddress1234', usdValue: 2820.00, icon: 'Ł' },
  ];

  const transactions = [
    {
      id: 'TX-DEP-982134',
      type: 'DEPOSIT',
      currency: 'USDT',
      amount: 1000.0,
      fee: 0.0,
      status: 'COMPLETED',
      date: '2026-07-27 10:14',
      txHash: '0x8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      description: 'USDT TRC20 Blockchain Deposit',
    },
    {
      id: 'TX-GC-551029',
      type: 'GIFT_CARD_PAYOUT',
      currency: 'USDT',
      amount: 425.00,
      fee: 0.0,
      status: 'COMPLETED',
      date: '2026-07-26 18:30',
      txHash: 'INTERNAL-GC-PAYOUT-88910',
      description: '$500 Apple Gift Card Payout (85% Rate)',
    },
    {
      id: 'TX-WTH-882103',
      type: 'WITHDRAWAL',
      currency: 'BTC',
      amount: 0.05,
      fee: 0.0002,
      status: 'COMPLETED',
      date: '2026-07-24 14:10',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      description: 'External Bitcoin Wallet Withdrawal',
    },
    {
      id: 'TX-WTH-990182',
      type: 'WITHDRAWAL',
      currency: 'USDT',
      amount: 200.0,
      fee: 2.5,
      status: 'PENDING',
      date: '2026-07-27 21:05',
      txHash: 'PENDING_APPROVAL',
      description: 'Pending USDT TRC20 Withdrawal',
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesAsset = filterAsset === 'ALL' || tx.currency === filterAsset;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAsset && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Crypto Wallets & Ledger</h1>
          <p className="text-xs text-slate-400">Manage balances, monitor deposits, and review complete transaction logs</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/wallet/deposit">
            <Button variant="primary" size="md" leftIcon={<ArrowDownLeft className="w-4 h-4" />}>
              Deposit Crypto
            </Button>
          </Link>
          <Link href="/wallet/withdraw">
            <Button variant="secondary" size="md" leftIcon={<ArrowUpRight className="w-4 h-4" />}>
              Withdraw Funds
            </Button>
          </Link>
        </div>
      </div>

      {/* Asset Cards Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {wallets.map((w) => (
          <Card key={w.currency} hoverable className="p-5 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{w.icon}</span>
              <Badge variant="blue" size="sm">{w.currency}</Badge>
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono">{w.balance} {w.currency}</p>
              <p className="text-xs text-slate-400">≈ ${w.usdValue.toLocaleString()} USD</p>
              {w.pending > 0 && (
                <p className="text-[10px] text-amber-400 font-medium mt-1">Pending: +{w.pending} {w.currency}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Transaction Ledger & Filters */}
      <Card className="p-6 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Transaction History</h2>

          {/* Filter Bar */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search reference or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full sm:w-64"
            />

            <select
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value)}
              className="glass-input rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Assets</option>
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="TRX">TRX</option>
              <option value="LTC">LTC</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1E2026] text-[#848E9C] uppercase tracking-wider border-b border-[#2B2F36]">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Type</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B2F36]/60">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#2B2F36]/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#FCD535]">{tx.id}</td>
                  <td className="p-4">
                    <span className="font-semibold text-[#EAECEF]">{tx.type.replace('_', ' ')}</span>
                  </td>
                  <td className="p-4 font-bold text-[#EAECEF]">{tx.currency}</td>
                  <td className="p-4 font-mono font-bold text-white">
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'} {tx.amount} {tx.currency}
                  </td>
                  <td className="p-4 font-mono text-[#848E9C]">{tx.fee} {tx.currency}</td>
                  <td className="p-4">
                    <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
