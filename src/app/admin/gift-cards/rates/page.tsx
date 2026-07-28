'use client';

import React, { useState } from 'react';
import { Percent, Edit, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminGiftCardRatesPage() {
  const [rates, setRates] = useState([
    { id: '1', brand: 'Apple', country: 'US', cardType: 'PHYSICAL', ratePercentage: 85.0, min: 10, max: 1000, isActive: true },
    { id: '2', brand: 'Apple', country: 'US', cardType: 'ECODE', ratePercentage: 80.0, min: 10, max: 1000, isActive: true },
    { id: '3', brand: 'Amazon', country: 'US', cardType: 'PHYSICAL', ratePercentage: 82.0, min: 10, max: 1000, isActive: true },
    { id: '4', brand: 'Amazon', country: 'US', cardType: 'ECODE', ratePercentage: 78.0, min: 10, max: 1000, isActive: true },
    { id: '5', brand: 'Steam', country: 'US', cardType: 'PHYSICAL', ratePercentage: 88.0, min: 10, max: 1000, isActive: true },
    { id: '6', brand: 'Visa', country: 'US', cardType: 'PHYSICAL', ratePercentage: 90.0, min: 10, max: 1000, isActive: true },
  ]);

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
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Brand</th>
                <th className="p-4">Country</th>
                <th className="p-4">Card Format</th>
                <th className="p-4">Payout Rate (%)</th>
                <th className="p-4">Limits ($)</th>
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
                  <td className="p-4 font-mono text-slate-400">${rate.min} - ${rate.max}</td>
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
      </Card>
    </div>
  );
}
