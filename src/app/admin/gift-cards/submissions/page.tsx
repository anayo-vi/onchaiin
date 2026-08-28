'use client';

import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle2, XCircle, Eye, Download, DollarSign, Wallet, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

export default function AdminGiftCardsSubmissionsPage() {
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Live database submissions state
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Fetch real user gift card submissions directly from PostgreSQL database API
  useEffect(() => {
    async function loadSubmissions() {
      try {
        const res = await fetch('/api/admin/gift-cards/submissions');
        const data = await res.json();
        if (data?.success && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
        }
      } catch (err) {
        console.warn('Error loading live database submissions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubmissions();
  }, []);

  // Calculate real statistical metrics dynamically from PostgreSQL database records
  const totalSubmissions = submissions.length;
  const totalFaceValue = submissions.reduce((acc, s) => acc + (s.denomination || 0), 0);
  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING');
  const pendingValue = pendingSubmissions.reduce((acc, s) => acc + (s.denomination || 0), 0);
  const approvedPayouts = submissions
    .filter((s) => s.status === 'APPROVED')
    .reduce((acc, s) => acc + (s.calculatedPayout || 0), 0);

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/admin/gift-cards/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'APPROVED' }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
      );
    } catch (err) {
      console.warn('Error approving submission in DB:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch('/api/admin/gift-cards/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'REJECTED' }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'REJECTED' } : s))
      );
    } catch (err) {
      console.warn('Error rejecting submission in DB:', err);
    } finally {
      setIsModalOpen(false);
      setRejectionReason('');
    }
  };

  // Browser Direct Asset Download Trigger for user-uploaded image
  const handleDownloadAsset = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Apple Gift Card Submissions & Fee Verification</h1>
          <p className="text-xs text-slate-400">Inspect card images, verify $2,500 withdrawal administrative fees, and download user uploaded asset files</p>
        </div>

        <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-[#FCD535]/15 border-[#FCD535]/40 text-white">
          <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Database Live Submissions
        </Badge>
      </div>

      {/* Real Statistics Bar computed live from PostgreSQL database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-slate-800 space-y-1 bg-[#111A2E]/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
          <p className="text-2xl font-black text-white">{totalSubmissions} Submissions</p>
          <p className="text-[11px] text-slate-400">Database User Records</p>
        </Card>

        <Card hoverable className="p-4 border-slate-800 space-y-1 bg-[#111A2E]/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Card Value</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            ${totalFaceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </p>
          <p className="text-[11px] text-slate-400">Combined Face Value</p>
        </Card>

        <Card hoverable className="p-4 border-slate-800 space-y-1 bg-[#111A2E]/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Fee Queue</span>
          <p className="text-2xl font-black text-amber-400 font-mono">
            ${pendingValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </p>
          <p className="text-[11px] text-amber-400 font-bold">{pendingSubmissions.length} Fee Verification Queue</p>
        </Card>

        <Card hoverable className="p-4 border-slate-800 space-y-1 bg-[#111A2E]/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Payouts</span>
          <p className="text-2xl font-black text-[#6EB7FF] font-mono">
            ${approvedPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
          </p>
          <p className="text-[11px] text-slate-400">Processed & Verified</p>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="p-6 border-slate-800 space-y-6 bg-[#111A2E]/80">
        <div className="overflow-x-auto">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Gift className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-bold">No user gift card submissions in database queue</p>
              <p className="text-xs text-slate-500">Submissions uploaded by users during withdrawal fee payment will appear here in real time.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Submission ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Brand & Purpose</th>
                  <th className="p-4">Card Value</th>
                  <th className="p-4">Payout / Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#6EB7FF] truncate max-w-[120px]">{sub.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{sub.userName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{sub.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{sub.brand} Apple Gift Card</p>
                      <span className="text-[10px] text-amber-400 font-medium">{sub.purpose}</span>
                    </td>
                    <td className="p-4 font-mono text-white font-bold">${(sub.denomination || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">${(sub.calculatedPayout || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</td>
                    <td className="p-4">
                      <Badge variant={sub.status === 'APPROVED' ? 'success' : sub.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-[11px] font-bold gradient-bg-blue text-[#0B1220]"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setSelectedSub(sub);
                          setIsModalOpen(true);
                        }}
                      >
                        Inspect & Verify
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Inspect & Action Modal for User Uploaded Assets */}
      {selectedSub && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Review ${selectedSub.brand} Card Submission (${selectedSub.id})`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B1220] border border-slate-800">
              <div>
                <p className="text-slate-400">Card Code / Serial:</p>
                <p className="font-mono text-sm font-bold text-[#6EB7FF]">{selectedSub.cardCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Value / Fee Amount:</p>
                <p className="font-mono text-sm font-bold text-emerald-400">
                  ${(selectedSub.calculatedPayout || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </p>
              </div>
            </div>

            {/* Image Viewer & Direct Asset Download Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white">User Uploaded Apple Gift Card Image:</p>
                <span className="text-[11px] text-slate-400">Click button below to download high-res file</span>
              </div>

              <div>
                {selectedSub.frontImageUrl && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-[#0B1220] border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300">User Uploaded Apple Card Photo</p>
                    <img src={selectedSub.frontImageUrl} alt="Apple Gift Card" className="w-full h-56 object-cover rounded-lg border border-slate-700" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs"
                      leftIcon={<Download className="w-3.5 h-3.5 text-[#6EB7FF]" />}
                      onClick={() => handleDownloadAsset(selectedSub.frontImageUrl, `User_Apple_Gift_Card_${selectedSub.id}.jpg`)}
                    >
                      Download Uploaded Card File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {selectedSub.status === 'PENDING' && (
              <div className="flex space-x-4 pt-4 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1 text-rose-400 hover:bg-rose-500/10 font-bold"
                  onClick={() => handleReject(selectedSub.id)}
                >
                  Reject Submission
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
                  onClick={() => handleApprove(selectedSub.id)}
                >
                  Verify & Approve Fee
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
