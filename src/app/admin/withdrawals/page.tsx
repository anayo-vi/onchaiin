'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, XCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/admin/withdrawals');
      const data = await res.json();
      if (data?.success && Array.isArray(data.withdrawals)) {
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.warn('Error loading withdrawals from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    const interval = setInterval(fetchWithdrawals, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'COMPLETED' }),
      });
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: 'COMPLETED' } : w))
      );
    } catch (err) {
      console.warn('Error approving withdrawal in DB:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'REJECTED' }),
      });
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: 'REJECTED' } : w))
      );
    } catch (err) {
      console.warn('Error rejecting withdrawal in DB:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Withdrawal Approvals</h1>
          <p className="text-xs text-slate-400">Review pending user withdrawal requests and trigger external payouts in real-time</p>
        </div>

        <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-[#FCD535]/15 border-[#FCD535]/40 text-white">
          <ShieldCheck className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Database Live Stream
        </Badge>
      </div>

      <Card className="p-6 border-slate-800 space-y-6 bg-[#111A2E]/80">
        <div className="overflow-x-auto">
          {withdrawals.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ArrowUpRight className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-bold">No user withdrawal requests in database queue</p>
              <p className="text-xs text-slate-500">Submissions created by users in the withdrawal portal will appear here live.</p>
            </div>
          ) : (
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
                  <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#6EB7FF] truncate max-w-[130px]">{w.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{w.userName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{w.userEmail}</p>
                    </td>
                    <td className="p-4 font-mono text-white font-bold">${(w.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} {w.currency}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">${(w.netAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} {w.currency}</td>
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
          )}
        </div>
      </Card>
    </div>
  );
}
