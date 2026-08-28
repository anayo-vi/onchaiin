'use client';

import React, { useState } from 'react';
import { BellRing, Send, CheckCircle2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminBroadcastsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('ALL');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, targetGroup }),
      });
      const data = await res.json();
      if (data?.success) {
        setSentCount(data.sent || 0);
        setSentSuccess(true);
        setTitle('');
        setMessage('');
        setTimeout(() => setSentSuccess(false), 5000);
      } else {
        setError(data?.error || 'Failed to send broadcast');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.warn('Broadcast error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Platform Announcements & Broadcasts</h1>
        <p className="text-xs text-slate-400">Send system-wide notifications, maintenance alerts, or promotional announcements to all users in real time</p>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        {sentSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Announcement broadcasted successfully to <strong>{sentCount} users</strong>!</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-4">
          <Input
            label="Announcement Title"
            type="text"
            placeholder="e.g. Scheduled System Upgrade"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Target Audience</label>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Users & Traders</option>
              <option value="KYC_VERIFIED">KYC Verified Users Only</option>
              <option value="UNVERIFIED">Unverified Users Only</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Notification Content</label>
            <textarea
              rows={4}
              placeholder="Enter announcement message text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Send className="w-4 h-4" />}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Broadcast Announcement'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
