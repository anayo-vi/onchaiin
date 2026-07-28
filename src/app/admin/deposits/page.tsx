'use client';

import React from 'react';
import { ArrowDownLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminDepositsPage() {
  const deposits = [
    {
      id: 'DEP-982134',
      userName: 'Alex Vance',
      currency: 'USDT',
      amount: 1000.0,
      txHash: '0x8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      confirmations: '12 / 3',
      status: 'CONFIRMED',
      date: '2026-07-27 10:14',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Crypto Deposits Monitor</h1>
          <p className="text-xs text-slate-400">Track blockchain confirmations and manual deposit credits</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Deposit ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Confirmations</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-purple-300">{dep.id}</td>
                  <td className="p-4 font-bold text-white">{dep.userName}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">+{dep.amount} {dep.currency}</td>
                  <td className="p-4 font-mono text-slate-300">{dep.confirmations}</td>
                  <td className="p-4">
                    <Badge variant="success" size="sm">{dep.status}</Badge>
                  </td>
                  <td className="p-4 text-slate-400">{dep.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
