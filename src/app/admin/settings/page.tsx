'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, DollarSign, Gift, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minWithdrawalUsdt, setMinWithdrawalUsdt] = useState('100');
  const [withdrawalFeeUSD, setWithdrawalFeeUSD] = useState('2000');
  const [feePaymentMethod, setFeePaymentMethod] = useState('Apple Gift Card');
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
        <h1 className="text-2xl font-black text-white">Platform Settings & Fee Control</h1>
        <p className="text-xs text-slate-400">Configure global withdrawal fee limits, Apple Gift Card fee rules, and system parameters</p>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Platform withdrawal fee & settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Withdrawal Fee Control Box */}
          <div className="p-5 rounded-2xl bg-[#0B1220] border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Withdrawal Administrative Fee Configuration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Required Administrative Fee ($ USD)"
                type="number"
                value={withdrawalFeeUSD}
                onChange={(e) => setWithdrawalFeeUSD(e.target.value)}
                leftIcon={<DollarSign className="w-4 h-4 text-[#6EB7FF]" />}
                required
              />

              <Input
                label="Fee Payment Method"
                type="text"
                value={feePaymentMethod}
                onChange={(e) => setFeePaymentMethod(e.target.value)}
                leftIcon={<Gift className="w-4 h-4 text-[#6EB7FF]" />}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Require KYC Verification for Withdrawals</p>
              <p className="text-xs text-slate-400">Enforce identity check before processing external payouts</p>
            </div>
            <input
              type="checkbox"
              checked={requireKyc}
              onChange={(e) => setRequireKyc(e.target.checked)}
              className="w-5 h-5 rounded accent-purple-600 bg-slate-900 border-slate-700"
            />
          </div>

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

          <Button type="submit" variant="primary" size="md" className="gradient-bg-blue text-[#0B1220] font-extrabold shadow-lg shadow-[#5A9BFF]/25 py-3" leftIcon={<Save className="w-4 h-4" />}>
            Save Platform Fee Settings
          </Button>
        </form>
      </Card>
    </div>
  );
}
