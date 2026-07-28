'use client';

import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, Eye, Download, User, Calendar, MapPin, Phone, ExternalLink, FileImage } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export default function AdminKYCPage() {
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [kycs, setKycs] = useState([
    {
      id: 'KYC-9012',
      userName: 'Leo Garcia Arthur',
      userEmail: 'leogarcia39@onchaiin.com',
      phone: '+1 (505) 730-8886',
      dob: '1985-05-14',
      country: 'United States',
      city: 'New Mexico',
      address: 'Ocean Drive 402, New Mexico',
      idType: 'PASSPORT',
      idNumber: 'P98230192',
      frontUrl: '/profile-pic.jpeg',
      backUrl: '/profile-pic.jpeg',
      selfieUrl: '/profile-pic.jpeg',
      uploadedAssets: [
        { name: 'Passport Front Document', url: '/profile-pic.jpeg', type: 'IMAGE' },
        { name: 'Passport Back Document', url: '/profile-pic.jpeg', type: 'IMAGE' },
        { name: 'Selfie Verification Photo', url: '/profile-pic.jpeg', type: 'IMAGE' },
        { name: 'Apple Gift Card Front Upload', url: '/profile-pic.jpeg', type: 'IMAGE' },
        { name: 'Apple Gift Card Back Upload (PIN)', url: '/profile-pic.jpeg', type: 'IMAGE' },
      ],
      status: 'APPROVED',
      date: '2026-07-20 11:30',
    },
    {
      id: 'KYC-9013',
      userName: 'Alex Vance',
      userEmail: 'alex@onchaiin.com',
      phone: '+1 (555) 392-1092',
      dob: '1990-09-22',
      country: 'United States',
      city: 'Miami',
      address: '742 Evergreen Terrace',
      idType: 'DRIVERS_LICENSE',
      idNumber: 'DL-88192019',
      frontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
      backUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
      selfieUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500',
      uploadedAssets: [
        { name: 'Driver License Front', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500', type: 'IMAGE' },
        { name: 'Selfie Photo', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500', type: 'IMAGE' },
      ],
      status: 'APPROVED',
      date: '2026-07-22 14:15',
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

  // Helper function to trigger browser asset download
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">KYC & Asset Verification Manager</h1>
          <p className="text-xs text-slate-400">Inspect user identity details, passport documents, and download all user uploaded asset files</p>
        </div>
      </div>

      <Card className="p-6 border-slate-800 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Submission ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Document Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {kycs.map((k) => (
                <tr key={k.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-purple-300">{k.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{k.userName}</p>
                    <p className="text-[11px] text-slate-400">{k.userEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-200 font-mono">{k.phone}</p>
                    <p className="text-[11px] text-slate-400">{k.city}, {k.country}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-200">{k.idType} ({k.idNumber})</td>
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
                      className="gradient-bg-blue text-[#0B1220] font-bold"
                      onClick={() => {
                        setSelectedKyc(k);
                        setIsModalOpen(true);
                      }}
                    >
                      Inspect KYC & Assets
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* KYC Details & Uploaded Assets Viewer Modal */}
      {selectedKyc && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`KYC Details & Uploaded Assets for ${selectedKyc.userName}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* User Personal Details Box */}
            <div className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center space-x-2">
                <User className="w-4 h-4 text-[#6EB7FF]" />
                <span>Identity Details</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <p>Full Legal Name: <strong className="text-white">{selectedKyc.userName}</strong></p>
                <p>Date of Birth: <strong className="text-white">{selectedKyc.dob}</strong></p>
                <p>Phone Number: <strong className="text-white font-mono">{selectedKyc.phone}</strong></p>
                <p>Document Type: <strong className="text-white">{selectedKyc.idType}</strong></p>
                <p>Document ID No: <strong className="text-white font-mono">{selectedKyc.idNumber}</strong></p>
                <p>Address: <strong className="text-white">{selectedKyc.address}</strong></p>
              </div>
            </div>

            {/* View and Download Uploaded Assets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <FileImage className="w-4 h-4 text-purple-400" />
                <span>Uploaded Documents & Assets ({selectedKyc.uploadedAssets.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedKyc.uploadedAssets.map((asset: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-[11px] truncate max-w-[170px]">{asset.name}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Download className="w-3.5 h-3.5 text-[#6EB7FF]" />}
                        onClick={() => handleDownloadAsset(asset.url, `${selectedKyc.userName}_${asset.name}.png`)}
                      >
                        Download
                      </Button>
                    </div>

                    <div className="relative group overflow-hidden rounded-xl border border-slate-800">
                      <img src={asset.url} alt={asset.name} className="w-full h-32 object-cover transition-transform group-hover:scale-105" />
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" /> View Full Image
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-slate-800">
              <Button variant="danger" size="md" className="flex-1" onClick={() => handleReject(selectedKyc.id)}>
                Reject Submission
              </Button>
              <Button variant="success" size="md" className="flex-1" onClick={() => handleApprove(selectedKyc.id)}>
                Approve KYC & Verification
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
