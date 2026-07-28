'use client';

import React from 'react';
import { ClipboardList, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminAuditLogsPage() {
  const logs = [
    {
      id: 'LOG-1002',
      adminName: 'System Admin',
      action: 'APPROVE_GIFTCARD',
      resource: 'GIFTCARD',
      targetId: 'GC-SUB-88120',
      ipAddress: '192.168.1.1',
      date: '2026-07-26 14:12',
    },
    {
      id: 'LOG-1001',
      adminName: 'System Admin',
      action: 'APPROVE_KYC',
      resource: 'KYC',
      targetId: 'KYC-9012',
      ipAddress: '192.168.1.1',
      date: '2026-07-20 11:30',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">System Audit Logs</h1>
          <p className="text-xs text-slate-400">Immutable chronological security log of all administrative actions and parameter edits</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Log ID</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-purple-300">{log.id}</td>
                  <td className="p-4 font-bold text-white">{log.adminName}</td>
                  <td className="p-4">
                    <Badge variant="purple" size="sm">{log.action}</Badge>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{log.resource} ({log.targetId})</td>
                  <td className="p-4 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="p-4 text-slate-400">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
