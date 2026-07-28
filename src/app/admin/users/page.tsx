'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, CheckCircle2, Bell, ShieldCheck, DollarSign, Wallet, ShieldAlert, User, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Reset Account Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState(false);

  // Start with empty array — DB data loaded via useEffect below
  const [users, setUsers] = useState<any[]>([]);

  // Fetch live users directly from PostgreSQL database via API
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data?.success && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
        }
      } catch (err) {
        console.warn('Falling back to database seed users list:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  // Handle Top Up Execution — calls real DB API
  const handleExecuteTopUp = async () => {
    if (!topUpAmount || !selectedUser) return;
    const addedAmount = parseFloat(topUpAmount) || 0;
    if (addedAmount <= 0) return;

    try {
      const res = await fetch('/api/admin/users/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: selectedUser.email,
          amount: addedAmount,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        // Update local state to reflect new balance
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? { ...u, usdtBalance: data.newBalance }
              : u
          )
        );
        setSelectedUser((prev: any) => prev ? { ...prev, usdtBalance: data.newBalance } : prev);
      }
    } catch (err) {
      console.warn('Top up API error:', err);
    }

    setTopUpSuccessMsg(true);
    setTimeout(() => {
      setTopUpSuccessMsg(false);
      setIsTopUpModalOpen(false);
      setTopUpAmount('');
    }, 1500);
  };

  // Handle Send Notification Execution — calls real DB API
  const handleSendNotification = async () => {
    if (!notifTitle || !notifMessage || !selectedUser) return;

    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          title: notifTitle,
          message: notifMessage,
          category: notifCategory,
        }),
      });
    } catch (err) {
      console.warn('Notification API error:', err);
    }

    setNotifSuccessMsg(true);
    setTimeout(() => {
      setNotifSuccessMsg(false);
      setIsNotifModalOpen(false);
      setNotifTitle('');
      setNotifMessage('');
    }, 1500);
  };

  // Handle Reset Account — clears all history and zeros all balances
  const handleResetAccount = async () => {
    if (!selectedUser || resetConfirmText !== 'RESET') return;
    setResetLoading(true);
    try {
      const res = await fetch('/api/admin/users/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      });
      const data = await res.json();
      if (data?.success) {
        // Zero out the balance in local state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, usdtBalance: 0.0 } : u
          )
        );
        setSelectedUser((prev: any) => prev ? { ...prev, usdtBalance: 0.0 } : prev);
        setResetSuccessMsg(true);
        setTimeout(() => {
          setResetSuccessMsg(false);
          setIsResetModalOpen(false);
          setResetConfirmText('');
        }, 2000);
      }
    } catch (err) {
      console.warn('Reset API error:', err);
    } finally {
      setResetLoading(false);
    }
  };

  // Toggle Freeze Status
  const toggleFreezeStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFrozen: !u.isFrozen } : u))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Database User Management</h1>
          <p className="text-xs text-slate-400">
            Real-time management of active platform users registered in the PostgreSQL database ({users.length} Total Users)
          </p>
        </div>

        <Badge variant="warning" size="md" className="py-1.5 px-3.5 font-bold bg-amber-500/15 border-amber-500/40 text-amber-400">
          <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Database Live Sync
        </Badge>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Card className="px-4 py-2 bg-[#111A2E]/90 border-slate-800 flex items-center space-x-3">
            <span className="text-xs text-slate-400">Total Users:</span>
            <span className="text-sm font-black text-white">{users.length}</span>
          </Card>

          <Card className="px-4 py-2 bg-[#111A2E]/90 border-slate-800 flex items-center space-x-3">
            <span className="text-xs text-slate-400">Total User Funds:</span>
            <span className="text-sm font-mono font-black text-emerald-400">
              ${users.reduce((acc, u) => acc + (u.usdtBalance || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </span>
          </Card>
        </div>
      </div>

      {/* User Records Table */}
      <Card className="border-slate-800 overflow-hidden bg-[#111A2E]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">User / Account</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Location & Phone</th>
                <th className="py-4 px-6">Wallet Balance</th>
                <th className="py-4 px-6">KYC Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={u.avatar || '/profile-pic.jpeg'}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6EB7FF]/40"
                      />
                      <div>
                        <p className="font-extrabold text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <Badge variant={u.role === 'ADMIN' ? 'warning' : 'neutral'} size="sm">
                      {u.role}
                    </Badge>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{u.city}, {u.country}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{u.phone}</p>
                  </td>

                  <td className="py-4 px-6 font-mono font-black text-emerald-400">
                    ${(u.usdtBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </td>

                  <td className="py-4 px-6">
                    <Badge variant={u.kycStatus === 'APPROVED' ? 'success' : 'warning'} size="sm">
                      {u.kycStatus}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {/* Top Up Balance Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-[11px] font-bold gradient-bg-blue text-[#0B1220] px-3"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedUser(u);
                        setIsTopUpModalOpen(true);
                      }}
                    >
                      Top Up
                    </Button>

                    {/* Send Notification Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] font-bold px-3"
                      leftIcon={<Bell className="w-3.5 h-3.5 text-[#6EB7FF]" />}
                      onClick={() => {
                        setSelectedUser(u);
                        setIsNotifModalOpen(true);
                      }}
                    >
                      Notify
                    </Button>

                    {/* Reset Account Button — only for USER role */}
                    {u.role !== 'ADMIN' && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="text-[11px] font-bold px-2.5"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setSelectedUser(u);
                          setResetConfirmText('');
                          setResetSuccessMsg(false);
                          setIsResetModalOpen(true);
                        }}
                      >
                        Reset
                      </Button>
                    )}

                    {/* Freeze/Unfreeze Button */}
                    <Button
                      variant={u.isFrozen ? 'danger' : 'secondary'}
                      size="sm"
                      className="text-[11px] font-bold px-2.5"
                      onClick={() => toggleFreezeStatus(u.id)}
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
                <span>Successfully credited ${parseFloat(topUpAmount || '0').toLocaleString()} USD to {selectedUser.name}'s account!</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 space-y-1">
              <span className="text-slate-400">Current Balance:</span>
              <p className="text-lg font-mono font-black text-emerald-400">
                ${(selectedUser.usdtBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </p>
            </div>

            <Input
              label="Credit Amount ($ USD)"
              type="number"
              placeholder="e.g. 10000.00"
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
                onClick={handleExecuteTopUp}
              >
                Confirm Balance Top Up
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
                <span>Notification successfully sent to {selectedUser.name}!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Notification Category</label>
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
                placeholder="e.g. Your investment assets rose to 10% profits in the stock market!"
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
                Send Push Notification
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Reset Account Modal ── */}
      {selectedUser && (
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => {
            setIsResetModalOpen(false);
            setResetConfirmText('');
          }}
          title={`Reset Account — ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            {resetSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{selectedUser.name}'s account has been fully reset. Balance zeroed, history cleared.</span>
              </div>
            ) : (
              <>
                {/* Danger Warning */}
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-400 font-extrabold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>DESTRUCTIVE ACTION — IRREVERSIBLE</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    This will permanently delete <strong className="text-white">all transaction history</strong> and
                    set <strong className="text-white">all wallet balances to $0.00</strong> for this user.
                    This cannot be undone.
                  </p>
                </div>

                {/* User preview */}
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center space-x-3">
                  <img
                    src={selectedUser.avatar || '/profile-pic.jpeg'}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40"
                  />
                  <div>
                    <p className="font-extrabold text-white">{selectedUser.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedUser.email}</p>
                    <p className="text-[11px] text-rose-400 font-mono font-bold mt-0.5">
                      Current Balance: ${(selectedUser.usdtBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD → $0.00
                    </p>
                  </div>
                </div>

                {/* What will be deleted */}
                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-400 font-bold uppercase tracking-wider">The following will be permanently deleted:</p>
                  <ul className="space-y-1 text-slate-300">
                    {[
                      'All wallet ledger transactions',
                      'All withdrawal requests',
                      'All deposit records',
                      'All gift card submissions',
                      'All platform notifications',
                      'All wallet balances → reset to $0.00',
                    ].map((item) => (
                      <li key={item} className="flex items-center space-x-1.5">
                        <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirmation input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Type <span className="text-rose-400 font-black">RESET</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
                    placeholder="Type RESET here…"
                    className="w-full bg-[#0B1220] border border-rose-500/40 rounded-xl p-3 text-sm text-white font-mono font-bold placeholder:text-slate-600 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex space-x-3 pt-1">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      setIsResetModalOpen(false);
                      setResetConfirmText('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    className="flex-1 font-bold bg-rose-600 hover:bg-rose-500 text-white border-0"
                    disabled={resetConfirmText !== 'RESET' || resetLoading}
                    onClick={handleResetAccount}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    {resetLoading ? 'Resetting…' : 'Confirm Reset'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
