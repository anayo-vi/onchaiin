'use client';

import React, { useState } from 'react';
import { Gift, CheckCircle2, XCircle, Eye, AlertCircle } from 'lucide-react';
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
      id: 'GC-SUB-99102',
      userName: 'Alex Vance',
      userEmail: 'user@onchaiin.com',
      brand: 'Amazon',
      country: 'US',
      cardType: 'ECODE',
      denomination: 200.0,
      ratePercentage: 78.0,
      calculatedPayout: 156.0,
      cardCode: 'AMZ-889-109238',
      frontImageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500',
      backImageUrl: null,
      status: 'PENDING',
      date: '2026-07-27 18:45',
    },
    {
      id: 'GC-SUB-88120',
      userName: 'Alex Vance',
      userEmail: 'user@onchaiin.com',
      brand: 'Apple',
      country: 'US',
      cardType: 'PHYSICAL',
      denomination: 500.0,
      ratePercentage: 85.0,
      calculatedPayout: 425.0,
      cardCode: 'X9928-10923-88219',
      frontImageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
      backImageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500',
      status: 'APPROVED',
      date: '2026-07-26 14:12',
    },
  ]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Gift Card Submissions Review</h1>
          <p className="text-xs text-slate-400">Inspect submitted card images and codes, verify balances, and execute instant wallet payouts</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Submission ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Brand & Format</th>
                <th className="p-4">Face Value</th>
                <th className="p-4">Rate</th>
                <th className="p-4">Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-purple-300">{sub.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{sub.userName}</p>
                    <p className="text-[11px] text-slate-400">{sub.userEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{sub.brand} ({sub.country})</p>
                    <span className="text-[10px] text-slate-400">{sub.cardType}</span>
                  </td>
                  <td className="p-4 font-mono text-white">${sub.denomination}</td>
                  <td className="p-4 font-bold text-emerald-400">{sub.ratePercentage}%</td>
                  <td className="p-4 font-mono font-bold text-purple-300">${sub.calculatedPayout} USDT</td>
                  <td className="p-4">
                    <Badge variant={sub.status === 'APPROVED' ? 'success' : sub.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedSub(sub);
                        setIsModalOpen(true);
                      }}
                    >
                      Inspect & Process
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
          title={`Review ${selectedSub.brand} Card (${selectedSub.id})`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <p className="text-slate-400">Card Code / Serial:</p>
                <p className="font-mono text-sm font-bold text-purple-300">{selectedSub.cardCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400">Payout Amount:</p>
                <p className="font-mono text-sm font-bold text-emerald-400">${selectedSub.calculatedPayout} USDT</p>
              </div>
            </div>

            {/* Image Viewer */}
            <div className="space-y-2">
              <p className="font-bold text-slate-300">Submitted Card Images:</p>
              <div className="grid grid-cols-2 gap-4">
                {selectedSub.frontImageUrl && (
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">Front Image</p>
                    <img src={selectedSub.frontImageUrl} alt="Front" className="w-full h-48 object-cover rounded-xl border border-slate-800" />
                  </div>
                )}
                {selectedSub.backImageUrl && (
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">Back Image</p>
                    <img src={selectedSub.backImageUrl} alt="Back" className="w-full h-48 object-cover rounded-xl border border-slate-800" />
                  </div>
                )}
              </div>
            </div>

            {selectedSub.status === 'PENDING' && (
              <div className="flex space-x-4 pt-4 border-t border-slate-800">
                <Button
                  variant="danger"
                  size="md"
                  className="flex-1"
                  onClick={() => handleReject(selectedSub.id)}
                >
                  Reject Submission
                </Button>
                <Button
                  variant="success"
                  size="md"
                  className="flex-1"
                  onClick={() => handleApprove(selectedSub.id)}
                >
                  Approve & Auto-Credit User
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
