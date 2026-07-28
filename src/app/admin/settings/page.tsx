'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minWithdrawalUsdt, setMinWithdrawalUsdt] = useState('20');
  const [withdrawalFeeUsdt, setWithdrawalFeeUsdt] = useState('2.5');
  const [requireKyc, setRequireKyc] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Platform Settings & Control</h1>
        <p className="text-xs text-slate-400">Configure global system parameters, maintenance triggers, and fee structures</p>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Platform settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Platform Maintenance Mode</p>
              <p className="text-xs text-slate-400">Disable non-admin logins and trade processing temporarily</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Require KYC for Crypto Withdrawal</p>
              <p className="text-xs text-slate-400">Enforce Tier 2 verification before external payouts</p>
            </div>
            <input
              type="checkbox"
              checked={requireKyc}
              onChange={(e) => setRequireKyc(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Withdrawal (USDT)"
              type="number"
              value={minWithdrawalUsdt}
              onChange={(e) => setMinWithdrawalUsdt(e.target.value)}
            />

            <Input
              label="USDT Withdrawal Fixed Fee ($)"
              type="number"
              value={withdrawalFeeUsdt}
              onChange={(e) => setWithdrawalFeeUsdt(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
            Save Platform Settings
          </Button>
        </form>
      </Card>
    </div>
  );
}
