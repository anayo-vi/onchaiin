'use client';

import React, { useState } from 'react';
import { Search, Shield, Snowflake, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustCurrency, setAdjustCurrency] = useState('USDT');
  const [adjustReason, setAdjustReason] = useState('');

  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      name: 'Alex Vance',
      email: 'user@onchaiin.com',
      role: 'USER',
      kycStatus: 'APPROVED',
      isFrozen: false,
      usdtBalance: 1450.75,
      joinedDate: '2026-07-20',
    },
    {
      id: 'usr-2',
      name: 'System Admin',
      email: 'admin@onchaiin.com',
      role: 'ADMIN',
      kycStatus: 'APPROVED',
      isFrozen: false,
      usdtBalance: 250000.0,
      joinedDate: '2026-01-01',
    },
    {
      id: 'usr-3',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      role: 'USER',
      kycStatus: 'PENDING',
      isFrozen: true,
      usdtBalance: 0.0,
      joinedDate: '2026-07-25',
    },
  ]);

  const toggleFreeze = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFrozen: !u.isFrozen } : u))
    );
  };

  const handleAdjustBalance = () => {
    if (!selectedUser || !adjustAmount) return;
    const num = parseFloat(adjustAmount);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          const newBal = adjustType === 'CREDIT' ? u.usdtBalance + num : Math.max(0, u.usdtBalance - num);
          return { ...u, usdtBalance: newBal };
        }
        return u;
      })
    );
    setIsAdjustModalOpen(false);
    setAdjustAmount('');
    setAdjustReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">User Management</h1>
          <p className="text-xs text-slate-400">Search users, freeze accounts, modify roles, and execute manual ledger adjustments</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">KYC</th>
                <th className="p-4">USDT Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="p-4">
                    <p className="font-bold text-white">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === 'ADMIN' ? 'purple' : 'neutral'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.kycStatus === 'APPROVED' ? 'success' : 'warning'} size="sm">
                      {u.kycStatus}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">${u.usdtBalance.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={u.isFrozen ? 'danger' : 'success'} size="sm">
                      {u.isFrozen ? 'Frozen' : 'Active'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(u);
                        setIsAdjustModalOpen(true);
                      }}
                    >
                      Adjust Balance
                    </Button>
                    <Button
                      variant={u.isFrozen ? 'success' : 'danger'}
                      size="sm"
                      onClick={() => toggleFreeze(u.id)}
                    >
                      {u.isFrozen ? 'Unfreeze' : 'Freeze'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Balance Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title={`Adjust Balance for ${selectedUser?.name}`}
      >
        <div className="space-y-4 text-xs">
          <div className="flex space-x-3">
            <button
              onClick={() => setAdjustType('CREDIT')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                adjustType === 'CREDIT' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              + Credit Balance
            </button>
            <button
              onClick={() => setAdjustType('DEBIT')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                adjustType === 'DEBIT' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              - Debit Balance
            </button>
          </div>

          <Input
            label="Amount (USDT)"
            type="number"
            placeholder="e.g. 100.00"
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
          />

          <Input
            label="Reason for Adjustment (Audit Log)"
            type="text"
            placeholder="e.g. Admin manual refund"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
          />

          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={handleAdjustBalance}>
              Apply Adjustment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
