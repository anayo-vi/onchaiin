'use client';

import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export default function AdminKYCPage() {
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [kycs, setKycs] = useState([
    {
      id: 'KYC-9012',
      userName: 'Alex Vance',
      userEmail: 'user@onchaiin.com',
      idType: 'PASSPORT',
      idNumber: 'P98230192',
      frontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
      selfieUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500',
      status: 'APPROVED',
      date: '2026-07-20 11:30',
    },
  ]);

  const handleApprove = (id: string) => {
    setKycs((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'APPROVED' } : k))
    );
    setIsModalOpen(false);
  };

  const handleReject = (id: string) => {
    setKycs((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'REJECTED' } : k))
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">KYC Verification Queue</h1>
          <p className="text-xs text-slate-400">Review uploaded passports, driver's licenses, and selfie photos for compliance</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Submission ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Document Type</th>
                <th className="p-4">ID Number</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {kycs.map((k) => (
                <tr key={k.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-purple-300">{k.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{k.userName}</p>
                    <p className="text-[11px] text-slate-400">{k.userEmail}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-200">{k.idType}</td>
                  <td className="p-4 font-mono text-slate-300">{k.idNumber}</td>
                  <td className="p-4">
                    <Badge variant={k.status === 'APPROVED' ? 'success' : k.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                      {k.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedDoc(k);
                        setIsModalOpen(true);
                      }}
                    >
                      Inspect Documents
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedDoc && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`KYC Inspection for ${selectedDoc.userName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 mb-1">ID Document Photo</p>
                <img src={selectedDoc.frontUrl} alt="ID" className="w-full h-48 object-cover rounded-xl border border-slate-800" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Selfie Photo</p>
                <img src={selectedDoc.selfieUrl} alt="Selfie" className="w-full h-48 object-cover rounded-xl border border-slate-800" />
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-slate-800">
              <Button variant="danger" size="md" className="flex-1" onClick={() => handleReject(selectedDoc.id)}>
                Reject KYC
              </Button>
              <Button variant="success" size="md" className="flex-1" onClick={() => handleApprove(selectedDoc.id)}>
                Approve Tier 2 Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
