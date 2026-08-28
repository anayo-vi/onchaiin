'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeposits = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/deposits');
      const data = await res.json();
      if (data?.success && Array.isArray(data.deposits)) {
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.warn('Error loading deposits from DB:', err);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits(true);
    const interval = setInterval(() => loadDeposits(false), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Crypto Deposits Monitor</h1>
          <p className="text-xs text-slate-400">Track blockchain confirmations and manual deposit credits — live from database</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <RefreshCw className="w-8 h-8 mx-auto text-slate-500 animate-spin" />
              <p className="text-sm font-bold">Loading deposits from database...</p>
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ArrowDownLeft className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-bold">No deposits in database</p>
              <p className="text-xs text-slate-500">Crypto deposits will appear here in real time.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Deposit ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Tx Hash</th>
                  <th className="p-4">Confirmations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-mono font-bold text-purple-300 truncate max-w-[120px]">{dep.id.substring(0, 12)}...</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{dep.userName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{dep.userEmail}</p>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">+{dep.amount} {dep.currency}</td>
                    <td className="p-4 font-mono text-slate-400 truncate max-w-[120px]">{dep.txHash?.substring(0, 20)}...</td>
                    <td className="p-4 font-mono text-slate-300">{dep.confirmations}</td>
                    <td className="p-4">
                      <Badge variant={dep.status === 'CONFIRMED' ? 'success' : dep.status === 'FAILED' ? 'danger' : 'warning'} size="sm">
                        {dep.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-400">{dep.date}</td>
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
