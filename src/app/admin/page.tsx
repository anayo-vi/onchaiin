'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Gift, 
  ArrowUpRight, 
  FileCheck, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function AdminOverviewPage() {
  const kpis = [
    { title: 'Total Registered Users', value: '1,428', change: '+18 today', icon: Users, color: 'text-purple-400' },
    { title: 'Platform Trading Volume', value: '$14.8M', change: '+$420k this week', icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Pending Gift Cards', value: '4 Queue', change: 'Action Required', icon: Gift, color: 'text-amber-400' },
    { title: 'Pending Withdrawals', value: '2 Requests', change: '$4,250 USDT', icon: ArrowUpRight, color: 'text-rose-400' },
  ];

  const chartData = [
    { brand: 'Apple', volume: 14500 },
    { brand: 'Amazon', volume: 11200 },
    { brand: 'Steam', volume: 9800 },
    { brand: 'Google Play', volume: 6400 },
    { brand: 'Visa', volume: 18200 },
    { brand: 'Vanilla', volume: 12100 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Executive Control Dashboard</h1>
          <p className="text-xs text-slate-400">System metrics, pending queues, and liquidity management</p>
        </div>

        <Badge variant="warning" size="md">
          <ShieldAlert className="w-4 h-4 mr-1 inline-block" /> Superuser Mode
        </Badge>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} hoverable className="p-5 border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{kpi.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpi.change}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Analytics Chart & Pending Queue Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card glow className="p-6 border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white">Gift Card Volume by Brand (USD)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="brand" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                    }}
                  />
                  <Bar dataKey="volume" fill="#9333EA" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Action Required Queue</h3>
            <div className="space-y-3 text-xs">
              <Link href="/admin/gift-cards/submissions" className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-purple-500/50 block">
                <div>
                  <p className="font-bold text-white">4 Pending Gift Cards</p>
                  <p className="text-[11px] text-slate-400">Review card front & back images</p>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </Link>

              <Link href="/admin/withdrawals" className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-rose-500/50 block">
                <div>
                  <p className="font-bold text-white">2 Pending Withdrawals</p>
                  <p className="text-[11px] text-slate-400">Approve payout destination</p>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </Link>

              <Link href="/admin/kyc" className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-emerald-500/50 block">
                <div>
                  <p className="font-bold text-white">1 KYC Submission</p>
                  <p className="text-[11px] text-slate-400">Inspect passport photo</p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
