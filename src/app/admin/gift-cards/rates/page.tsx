'use client';

import React, { useState, useEffect } from 'react';
import { Percent, Save, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminGiftCardRatesPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch gift card rates from DB (via submissions brand/rate data)
  useEffect(() => {
    async function loadRates() {
      try {
        // Derive rates from actual approved gift card submissions in DB
        const res = await fetch('/api/admin/gift-cards/submissions');
        const data = await res.json();
        if (data?.success && Array.isArray(data.submissions)) {
          // Build unique brand/rate table from real submissions
          const brandMap: Record<string, any> = {};
          data.submissions.forEach((s: any) => {
            const key = `${s.brand}-${s.country || 'US'}`;
            if (!brandMap[key]) {
              brandMap[key] = {
                id: key,
                brand: s.brand,
                country: s.country || 'US',
                cardType: s.cardType || 'PHYSICAL',
                ratePercentage: s.ratePercentage || 85.0,
                isActive: true,
              };
            }
          });
          setRates(Object.values(brandMap));
        }
      } catch (err) {
        console.warn('Error loading rates:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRates();
  }, []);

  const handleRateChange = (id: string, newRate: number) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ratePercentage: newRate } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Exchange Rates Configurator</h1>
          <p className="text-xs text-slate-400">Configure real-time payout percentages for each brand, country, and format</p>
        </div>
        <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-[#FCD535]/15 border-[#FCD535]/40 text-white">
          <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Live from DB
        </Badge>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        {isLoading ? (
          <div className="text-center py-10 space-y-2">
            <RefreshCw className="w-6 h-6 mx-auto text-slate-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading rates from database...</p>
          </div>
        ) : rates.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Percent className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-bold text-slate-300">No rate data yet</p>
            <p className="text-xs text-slate-500">Rates will appear here once users submit gift cards. The system uses 100% payout rate for administrative withdrawal fees.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Card Format</th>
                  <th className="p-4">Payout Rate (%)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">{rate.brand}</td>
                    <td className="p-4 font-bold text-slate-300">{rate.country}</td>
                    <td className="p-4">
                      <Badge variant="purple" size="sm">{rate.cardType}</Badge>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={rate.ratePercentage}
                        onChange={(e) => handleRateChange(rate.id, parseFloat(e.target.value) || 0)}
                        className="w-20 glass-input px-2 py-1 text-xs font-mono font-bold text-emerald-400 rounded-lg text-center"
                      />
                      <span className="ml-1 text-emerald-400 font-bold">%</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={rate.isActive ? 'success' : 'neutral'} size="sm">
                        {rate.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
