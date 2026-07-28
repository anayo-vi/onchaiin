'use client';

import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([
    {
      id: 'WTH-990182',
      userName: 'Alex Vance',
      userEmail: 'user@onchaiin.com',
      currency: 'USDT',
      amount: 200.0,
      fee: 2.5,
      netAmount: 197.5,
      destinationAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      status: 'PENDING',
      date: '2026-07-27 21:05',
    },
    {
      id: 'WTH-882103',
      userName: 'Alex Vance',
      userEmail: 'user@onchaiin.com',
      currency: 'BTC',
      amount: 0.05,
      fee: 0.0002,
      netAmount: 0.0498,
      destinationAddress: 'bc1q9x0y2p3w4e5r6t7y8u9i0o1p2a3s4d5f6g7h8j',
      status: 'COMPLETED',
      date: '2026-07-24 14:10',
    },
  ]);

  const handleApprove = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'COMPLETED' } : w))
    );
  };

  const handleReject = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'REJECTED' } : w))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Withdrawal Approvals</h1>
          <p className="text-xs text-slate-400">Review pending user withdrawal requests and trigger external payouts</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Withdrawal ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Gross Amount</th>
                <th className="p-4">Net Amount</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-purple-300">{w.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{w.userName}</p>
                    <p className="text-[11px] text-slate-400">{w.userEmail}</p>
                  </td>
                  <td className="p-4 font-mono text-white">{w.amount} {w.currency}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{w.netAmount} {w.currency}</td>
                  <td className="p-4 font-mono text-slate-300 max-w-xs truncate">{w.destinationAddress}</td>
                  <td className="p-4">
                    <Badge variant={w.status === 'COMPLETED' ? 'success' : w.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                      {w.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {w.status === 'PENDING' && (
                      <>
                        <Button variant="danger" size="sm" onClick={() => handleReject(w.id)}>
                          Reject
                        </Button>
                        <Button variant="success" size="sm" onClick={() => handleApprove(w.id)}>
                          Approve Payout
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
