'use client';

import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, Bell, Download, ShieldCheck, DollarSign, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Top Up Balance Modal State
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpCurrency, setTopUpCurrency] = useState('USDT');
  const [topUpSuccessMsg, setTopUpSuccessMsg] = useState(false);

  // Send Notification Modal State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState<'PROFIT' | 'SECURITY' | 'SYSTEM'>('PROFIT');
  const [notifSuccessMsg, setNotifSuccessMsg] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      name: 'Leo Garcia Arthur',
      email: 'leogarcia39@onchaiin.com',
      role: 'USER',
      kycStatus: 'APPROVED',
      isFrozen: false,
      usdtBalance: 70482914.37,
      phone: '+1 (505) 730-8886',
      city: 'New Mexico',
      country: 'United States',
      joinedDate: '2026-07-20',
    },
    {
      id: 'usr-2',
      name: 'Alex Vance',
      email: 'alex@onchaiin.com',
      role: 'USER',
      kycStatus: 'APPROVED',
      isFrozen: false,
      usdtBalance: 1450.75,
      phone: '+1 (555) 392-1092',
      city: 'Miami',
      country: 'United States',
      joinedDate: '2026-07-22',
    },
    {
      id: 'usr-3',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      role: 'USER',
      kycStatus: 'PENDING',
      isFrozen: false,
      usdtBalance: 5200.00,
      phone: '+1 (555) 839-2019',
      city: 'New York',
      country: 'United States',
      joinedDate: '2026-07-25',
    },
  ]);

  const toggleFreeze = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFrozen: !u.isFrozen } : u))
    );
  };

  // Handle Top Up Balance
  const handleTopUpBalance = () => {
    if (!selectedUser || !topUpAmount) return;
    const num = parseFloat(topUpAmount) || 0;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          return { ...u, usdtBalance: u.usdtBalance + num };
        }
        return u;
      })
    );

    setTopUpSuccessMsg(true);
    setTimeout(() => {
      setTopUpSuccessMsg(false);
      setIsTopUpModalOpen(false);
      setTopUpAmount('');
    }, 1500);
  };

  // Handle Send Notification to User
  const handleSendNotification = () => {
    if (!selectedUser || !notifTitle || !notifMessage) return;

    setNotifSuccessMsg(true);
    setTimeout(() => {
      setNotifSuccessMsg(false);
      setIsNotifModalOpen(false);
      setNotifTitle('');
      setNotifMessage('');
    }, 1500);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">User Management</h1>
          <p className="text-xs text-slate-400">Manage user accounts, top up balances, send notifications, and inspect profiles</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by name, email, or city..."
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
                <th className="p-4">Phone / Location</th>
                <th className="p-4">KYC</th>
                <th className="p-4">USDT Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-200 font-mono">{u.phone}</p>
                    <p className="text-[11px] text-slate-400">{u.city}, {u.country}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.kycStatus === 'APPROVED' ? 'success' : 'warning'} size="sm">
                      {u.kycStatus}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                    ${u.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <Badge variant={u.isFrozen ? 'danger' : 'success'} size="sm">
                      {u.isFrozen ? 'Frozen' : 'Active'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="gradient-bg-blue text-[#0B1220] font-bold"
                      onClick={() => {
                        setSelectedUser(u);
                        setIsTopUpModalOpen(true);
                      }}
                    >
                      Top Up Balance
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Bell className="w-3.5 h-3.5 text-[#6EB7FF]" />}
                      onClick={() => {
                        setSelectedUser(u);
                        setIsNotifModalOpen(true);
                      }}
                    >
                      Send Notification
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

      {/* Top Up Balance Modal */}
      {selectedUser && (
        <Modal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          title={`Top Up Balance for ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            {topUpSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Successfully credited ${parseFloat(topUpAmount || '0').toLocaleString()} {topUpCurrency} to {selectedUser.name}'s wallet!</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 space-y-1">
              <span className="text-slate-400">Current Balance:</span>
              <p className="text-lg font-mono font-black text-emerald-400">
                ${selectedUser.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
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
                onClick={handleTopUpBalance}
              >
                Execute Balance Top Up
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Send Notification Modal */}
      {selectedUser && (
        <Modal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          title={`Send Notification to ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            {notifSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Notification successfully sent to {selectedUser.name}'s inbox!</span>
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
              placeholder="e.g. Stock Market Investment Profit Update"
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
      )}
    </div>
  );
}
