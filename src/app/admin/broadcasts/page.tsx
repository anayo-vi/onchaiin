'use client';

import React, { useState } from 'react';
import { BellRing, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminBroadcastsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('ALL');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTitle('');
    setMessage('');
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Platform Announcements & Broadcasts</h1>
        <p className="text-xs text-slate-400">Send system-wide notifications, maintenance alerts, or promotional announcements</p>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        {sentSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Announcement broadcasted successfully to all platform users!</span>
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

          <Button type="submit" variant="primary" size="lg" leftIcon={<Send className="w-4 h-4" />}>
            Broadcast Announcement
          </Button>
        </form>
      </Card>
    </div>
  );
}
