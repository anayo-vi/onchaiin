'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, CheckCircle2, Bell, ShieldCheck, DollarSign, Wallet, ShieldAlert, User, RotateCcw, AlertTriangle, UserPlus, Edit3, Lock, Unlock } from 'lucide-react';
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

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCity, setNewUserCity] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('United States');
  const [newUserBalance, setNewUserBalance] = useState('0.00');
  const [addUserSuccessMsg, setAddUserSuccessMsg] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  // Edit User Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editKycStatus, setEditKycStatus] = useState('APPROVED');
  const [editSuccessMsg, setEditSuccessMsg] = useState(false);

  // Start with empty array — DB data loaded via useEffect below
  const [users, setUsers] = useState<any[]>([]);

  // Fetch live users directly from PostgreSQL database via API
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data?.success && Array.isArray(data.users) && data.users.length > 0) {
        setUsers(data.users);
      }
    } catch (err) {
      console.warn('Error loading database users list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
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

  // Handle Reset Account — clears all history and zeros all balances in DB
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

  // Toggle Freeze Status directly in PostgreSQL database
  const toggleFreezeStatus = async (userId: string, currentFrozen: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isFrozen: !currentFrozen }),
      });
      const data = await res.json();
      if (data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isFrozen: !currentFrozen } : u))
        );
      }
    } catch (err) {
      console.warn('Freeze status toggle error:', err);
    }
  };

  // Handle Add New User in DB
  const handleCreateUser = async () => {
    setAddUserError('');
    if (!newUserEmail) {
      setAddUserError('Email is required');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          phone: newUserPhone,
          city: newUserCity,
          country: newUserCountry,
          initialBalance: newUserBalance,
        }),
      });
      const data = await res.json();
      if (data?.error) {
        setAddUserError(data.error);
        return;
      }
      if (data?.success) {
        setAddUserSuccessMsg(true);
        loadUsers();
        setTimeout(() => {
          setAddUserSuccessMsg(false);
          setIsAddUserModalOpen(false);
          setNewUserName('');
          setNewUserEmail('');
          setNewUserPhone('');
          setNewUserCity('');
          setNewUserBalance('0.00');
        }, 1500);
      }
    } catch (err) {
      setAddUserError('Failed to create user account');
    }
  };

  // Handle Edit User Profile & KYC in DB
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          name: editName,
          phone: editPhone,
          city: editCity,
          country: editCountry,
          kycStatus: editKycStatus,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setEditSuccessMsg(true);
        loadUsers();
        setTimeout(() => {
          setEditSuccessMsg(false);
          setIsEditModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.warn('Update user error:', err);
    }
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

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            className="font-bold gradient-bg-blue text-[#0B1220] shadow-lg shadow-[#6EB7FF]/20"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add New User
          </Button>

          <Badge variant="warning" size="md" className="py-1.5 px-3.5 font-bold bg-[#FCD535]/15 border-[#FCD535]/40 text-white">
            <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Database Live Sync
          </Badge>
        </div>
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
                <tr key={u.id} className={`hover:bg-slate-800/30 transition-colors ${u.isFrozen ? 'opacity-60 bg-rose-950/10' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={u.avatar || '/profile-pic.jpeg'}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6EB7FF]/40"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-extrabold text-white">{u.name}</p>
                          {u.isFrozen && (
                            <Badge variant="danger" size="sm" className="text-[9px] py-0 px-1.5">FROZEN</Badge>
                          )}
                        </div>
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
                    <Badge variant={u.kycStatus === 'APPROVED' ? 'success' : u.kycStatus === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                      {u.kycStatus}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {/* Top Up Balance Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-[11px] font-bold gradient-bg-blue text-[#0B1220] px-2.5"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedUser(u);
                        setIsTopUpModalOpen(true);
                      }}
                    >
                      Top Up
                    </Button>

                    {/* Edit Profile & KYC Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-[11px] font-bold px-2.5"
                      leftIcon={<Edit3 className="w-3.5 h-3.5 text-[#6EB7FF]" />}
                      onClick={() => {
                        setSelectedUser(u);
                        setEditName(u.name);
                        setEditPhone(u.phone);
                        setEditCity(u.city);
                        setEditCountry(u.country);
                        setEditKycStatus(u.kycStatus);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    {/* Send Notification Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] font-bold px-2.5"
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
                      leftIcon={u.isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      onClick={() => toggleFreezeStatus(u.id, u.isFrozen)}
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

      {/* Add New User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User Account to Database"
      >
        <div className="space-y-4 text-xs">
          {addUserSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>User account successfully created in database!</span>
            </div>
          )}

          {addUserError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center space-x-2 text-rose-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{addUserError}</span>
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="sarah@example.com"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="+1 (505) 555-0199"
              value={newUserPhone}
              onChange={(e) => setNewUserPhone(e.target.value)}
            />
            <Input
              label="City"
              placeholder="New York"
              value={newUserCity}
              onChange={(e) => setNewUserCity(e.target.value)}
            />
          </div>

          <Input
            label="Initial Wallet Credit ($ USD)"
            type="number"
            placeholder="0.00"
            value={newUserBalance}
            onChange={(e) => setNewUserBalance(e.target.value)}
          />

          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
              onClick={handleCreateUser}
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit User Account: ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            {editSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>User details successfully updated in database!</span>
              </div>
            )}

            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <Input
                label="City"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">KYC Status Verification</label>
              <select
                className="w-full bg-[#0B1220] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                value={editKycStatus}
                onChange={(e) => setEditKycStatus(e.target.value)}
              >
                <option value="APPROVED">APPROVED (Verified)</option>
                <option value="PENDING">PENDING (In Review)</option>
                <option value="REJECTED">REJECTED (Unverified)</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
                onClick={handleUpdateUser}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
                  className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                    notifCategory === 'PROFIT'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  📈 Profit / Trade
                </button>
                <button
                  type="button"
                  onClick={() => setNotifCategory('SECURITY')}
                  className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                    notifCategory === 'SECURITY'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  🔒 Security Alert
                </button>
                <button
                  type="button"
                  onClick={() => setNotifCategory('SYSTEM')}
                  className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                    notifCategory === 'SYSTEM'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  ⚙️ System Update
                </button>
              </div>
            </div>

            <Input
              label="Notification Title"
              placeholder="e.g. Account Balance Updated"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Message Content</label>
              <textarea
                rows={3}
                className="w-full bg-[#0B1220] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6EB7FF]/60 resize-none"
                placeholder="Type push notification body..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
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

      {/* Reset Account Confirmation Modal */}
      {selectedUser && (
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title={`Reset Account for ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            {resetSuccessMsg ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{selectedUser.name}'s account balance and transaction history have been completely reset!</span>
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 space-y-1.5 text-rose-200">
                  <div className="flex items-center space-x-2 font-bold text-rose-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Warning: Irreversible Account Reset</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This action will reset <strong>{selectedUser.name}</strong>'s wallet balances to $0.00 USD and permanently clear all transaction history in the database.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Type <span className="font-mono text-rose-400">RESET</span> to confirm:
                  </label>
                  <Input
                    placeholder="RESET"
                    value={resetConfirmText}
                    onChange={(e) => setResetConfirmText(e.target.value)}
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsResetModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    className="flex-1 font-bold"
                    disabled={resetConfirmText !== 'RESET' || resetLoading}
                    onClick={handleResetAccount}
                  >
                    {resetLoading ? 'Resetting…' : 'Permanently Reset Account'}
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
