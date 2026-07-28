'use client';

import React, { useState } from 'react';
import { Gift, CheckCircle2, XCircle, Eye, Download, DollarSign, Wallet, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

export default function AdminGiftCardsSubmissionsPage() {
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [submissions, setSubmissions] = useState([
    {
      id: 'GC-SUB-2500-FEE',
      userName: 'Leo Garcia Arthur',
      userEmail: 'leogarcia39@onchaiin.com',
      brand: 'Apple',
      country: 'US',
      cardType: 'PHYSICAL',
      denomination: 2500.0,
      ratePercentage: 100.0,
      calculatedPayout: 2500.0,
      cardCode: 'X9928-10923-88219',
      frontImageUrl: '/profile-pic.jpeg',
      backImageUrl: '/profile-pic.jpeg',
      status: 'PENDING',
      purpose: 'Administrative Withdrawal Fee',
      date: 'Today, 14:15',
    },
    {
      id: 'GC-SUB-88120',
      userName: 'Leo Garcia Arthur',
      userEmail: 'leogarcia39@onchaiin.com',
      brand: 'Apple',
      country: 'US',
      cardType: 'PHYSICAL',
      denomination: 500.0,
      ratePercentage: 85.0,
      calculatedPayout: 425.0,
      cardCode: 'X7B98812KL09',
      frontImageUrl: '/profile-pic.jpeg',
      backImageUrl: '/profile-pic.jpeg',
      status: 'APPROVED',
      purpose: 'Wallet Top Up Payout',
      date: 'Yesterday, 10:30',
    },
  ]);

  // Calculate real statistical metrics
  const totalSubmissions = submissions.length;
  const totalFaceValue = submissions.reduce((acc, s) => acc + s.denomination, 0);
  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING');
  const pendingValue = pendingSubmissions.reduce((acc, s) => acc + s.denomination, 0);
  const approvedPayouts = submissions
    .filter((s) => s.status === 'APPROVED')
    .reduce((acc, s) => acc + s.calculatedPayout, 0);

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
    );
    setIsModalOpen(false);
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'REJECTED' } : s))
    );
    setIsModalOpen(false);
    setRejectionReason('');
  };

  // Browser Direct Asset Download Trigger
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
          <p className="text-xs text-slate-400">Inspect front and back card images, verify $2,500 withdrawal administrative fees, and download asset files</p>
        </div>

        <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-amber-500/15 border-amber-500/40 text-amber-400">
          <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Administrative Fee Inspector
        </Badge>
      </div>

      {/* Real Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-slate-800 space-y-1 bg-[#111A2E]/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
          <p className="text-2xl font-black text-white">{totalSubmissions} Submissions</p>
          <p className="text-[11px] text-slate-400">Leo Garcia Arthur Account</p>
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
                  <td className="p-4 font-mono font-bold text-[#6EB7FF]">{sub.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{sub.userName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{sub.userEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{sub.brand} Apple Gift Card</p>
                    <span className="text-[10px] text-amber-400 font-medium">{sub.purpose}</span>
                  </td>
                  <td className="p-4 font-mono text-white font-bold">${sub.denomination.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">${sub.calculatedPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</td>
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
        </div>
      </Card>

      {/* Inspect & Action Modal */}
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
                  ${selectedSub.calculatedPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </p>
              </div>
            </div>

            {/* Image Viewer & Direct Asset Download Buttons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white">Submitted Front & Back Gift Card Assets:</p>
                <span className="text-[11px] text-slate-400">Click button below to download high-res files</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSub.frontImageUrl && (
                  <div className="space-y-2 p-3 rounded-xl bg-[#0B1220] border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300">Front Card Image</p>
                    <img src={selectedSub.frontImageUrl} alt="Front" className="w-full h-44 object-cover rounded-lg border border-slate-700" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs"
                      leftIcon={<Download className="w-3.5 h-3.5 text-[#6EB7FF]" />}
                      onClick={() => handleDownloadAsset(selectedSub.frontImageUrl, `Apple_Gift_Card_Front_${selectedSub.id}.jpg`)}
                    >
                      Download Front Asset
                    </Button>
                  </div>
                )}

                {selectedSub.backImageUrl && (
                  <div className="space-y-2 p-3 rounded-xl bg-[#0B1220] border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300">Back Card Image (PIN Code)</p>
                    <img src={selectedSub.backImageUrl} alt="Back" className="w-full h-44 object-cover rounded-lg border border-slate-700" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs"
                      leftIcon={<Download className="w-3.5 h-3.5 text-purple-400" />}
                      onClick={() => handleDownloadAsset(selectedSub.backImageUrl, `Apple_Gift_Card_Back_${selectedSub.id}.jpg`)}
                    >
                      Download Back Asset
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
                  Reject Fee Submission
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
                  onClick={() => handleApprove(selectedSub.id)}
                >
                  Verify & Accept $2,500 Fee
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
