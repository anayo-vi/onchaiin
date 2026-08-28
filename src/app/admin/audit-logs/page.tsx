'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data?.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.warn('Error loading audit logs from DB:', err);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(true);
    const interval = setInterval(() => loadLogs(false), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">System Audit Logs</h1>
          <p className="text-xs text-slate-400">Immutable chronological security log of all administrative actions and parameter edits — live from database</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <RefreshCw className="w-8 h-8 mx-auto text-slate-500 animate-spin" />
              <p className="text-sm font-bold">Loading audit logs from database...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-bold">No audit log entries in database</p>
              <p className="text-xs text-slate-500">Administrative actions will be logged here in real time.</p>
            </div>
          ) : (
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
                    <td className="p-4 font-mono font-bold text-purple-300">{log.id.substring(0, 12)}...</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{log.adminName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{log.adminEmail}</p>
                    </td>
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
          )}
        </div>
      </Card>
    </div>
  );
}
