'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle2, XCircle, Eye, Download, FileImage, ShieldAlert, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export default function AdminKYCPage() {
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kycs, setKycs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadKycs = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/kyc');
      const data = await res.json();
      if (data?.success && Array.isArray(data.kycs)) {
        setKycs(data.kycs);
      }
    } catch (err) {
      console.warn('Error loading KYC docs from DB:', err);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKycs(true);
    const interval = setInterval(() => loadKycs(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'APPROVED' }),
      });
      setKycs((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'APPROVED' } : k)));
    } catch (err) {
      console.warn('Error approving KYC in DB:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'REJECTED' }),
      });
      setKycs((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'REJECTED' } : k)));
    } catch (err) {
      console.warn('Error rejecting KYC in DB:', err);
    } finally {
      setIsModalOpen(false);
    }
  };

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
          <h1 className="text-2xl font-black text-white">KYC Identity & Uploaded Asset Manager</h1>
          <p className="text-xs text-slate-400">Inspect user identity files, passport documents, and download all user uploaded asset files</p>
        </div>
        <Badge variant="warning" size="md" className="py-1.5 px-3 font-bold bg-[#FCD535]/15 border-[#FCD535]/40 text-white">
          <ShieldAlert className="w-4 h-4 mr-1.5 inline-block text-amber-400" /> Live Database
        </Badge>
      </div>

      <Card className="p-6 border-slate-800 space-y-6 bg-[#111A2E]/80">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <RefreshCw className="w-8 h-8 mx-auto text-slate-500 animate-spin" />
              <p className="text-sm font-bold">Loading KYC submissions from database...</p>
            </div>
          ) : kycs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileCheck className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-bold">No KYC submissions in database</p>
              <p className="text-xs text-slate-500">KYC documents submitted by users will appear here in real time.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Submission ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Document Type</th>
                  <th className="p-4">Document No.</th>
                  <th className="p-4">Uploaded Files</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {kycs.map((kyc) => {
                  const assets = [
                    kyc.frontUrl && { name: 'ID Document Front', url: kyc.frontUrl },
                    kyc.backUrl && kyc.backUrl !== '/profile-pic.jpeg' && { name: 'ID Document Back', url: kyc.backUrl },
                    kyc.selfieUrl && { name: 'Selfie Verification Photo', url: kyc.selfieUrl },
                    kyc.proofOfAddressUrl && { name: 'Proof of Address', url: kyc.proofOfAddressUrl },
                  ].filter(Boolean);

                  return (
                    <tr key={kyc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#6EB7FF] truncate max-w-[120px]">{kyc.id.substring(0, 12)}...</td>
                      <td className="p-4">
                        <p className="font-bold text-white">{kyc.userName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{kyc.userEmail}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="neutral" size="sm">{kyc.idType}</Badge>
                      </td>
                      <td className="p-4 font-mono text-white font-bold">{kyc.idNumber}</td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-400">{assets.length} Files Uploaded</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={kyc.status === 'APPROVED' ? 'success' : kyc.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                          {kyc.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-[11px] font-bold gradient-bg-blue text-[#0B1220]"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setSelectedKyc({ ...kyc, uploadedAssets: assets });
                            setIsModalOpen(true);
                          }}
                        >
                          Inspect & Download Assets
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {selectedKyc && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`KYC Identity Details & Uploaded Assets - ${selectedKyc.userName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B1220] border border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400">Full Legal Name:</span>
                <p className="font-bold text-white text-sm">{selectedKyc.userName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Phone Number:</span>
                <p className="font-bold text-[#6EB7FF] font-mono text-sm">{selectedKyc.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Date of Birth:</span>
                <p className="font-medium text-white">{selectedKyc.dob || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Residential Address:</span>
                <p className="font-medium text-white">{selectedKyc.address}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Document Type:</span>
                <p className="font-bold text-white">{selectedKyc.idType}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Document Number:</span>
                <p className="font-mono text-[#6EB7FF] font-bold">{selectedKyc.idNumber}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white text-sm">Uploaded User Assets & Documents ({selectedKyc.uploadedAssets?.length || 0}):</p>
                <span className="text-[11px] text-slate-400">Click download to save files locally</span>
              </div>

              <div className="space-y-2.5">
                {selectedKyc.uploadedAssets?.map((asset: any, index: number) => (
                  <div key={index} className="p-3 rounded-xl bg-[#0B1220] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-[#6EB7FF]/15 text-[#6EB7FF]">
                          <FileImage className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{asset.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Format: High-Res Image File</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-bold text-xs px-3"
                        leftIcon={<Download className="w-3.5 h-3.5 text-emerald-400" />}
                        onClick={() => handleDownloadAsset(asset.url, `${asset.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`)}
                      >
                        Download
                      </Button>
                    </div>
                    {/* Preview thumbnail */}
                    {asset.url && (
                      <img src={asset.url} alt={asset.name} className="w-full h-40 object-cover rounded-lg border border-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedKyc.status === 'PENDING' && (
              <div className="flex space-x-4 pt-4 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1 text-rose-400 hover:bg-rose-500/10 font-bold"
                  onClick={() => handleReject(selectedKyc.id)}
                >
                  Reject Verification
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
                  onClick={() => handleApprove(selectedKyc.id)}
                >
                  Approve KYC Verification
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
