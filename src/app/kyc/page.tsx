'use client';

import React, { useState } from 'react';
import { 
  FileCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function KYCPage() {
  const [step, setStep] = useState<number>(1);
  const [idType, setIdType] = useState<'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID'>('PASSPORT');
  const [idNumber, setIdNumber] = useState('');
  const [frontDoc, setFrontDoc] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<'UNVERIFIED' | 'PENDING' | 'APPROVED'>('APPROVED');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'front' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'front') setFrontDoc(reader.result as string);
        else setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitKYC = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setKycStatus('PENDING');
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">KYC Identity Verification</h1>
          <p className="text-xs text-slate-400">Verify your identity to increase withdrawal limits and unlock priority gift card processing</p>
        </div>

        <Badge variant={kycStatus === 'APPROVED' ? 'success' : kycStatus === 'PENDING' ? 'warning' : 'neutral'} size="md">
          <ShieldCheck className="w-4 h-4 mr-1 inline-block" />
          {kycStatus === 'APPROVED' ? 'Tier 2 Verified' : kycStatus === 'PENDING' ? 'Under Review' : 'Unverified'}
        </Badge>
      </div>

      {kycStatus === 'APPROVED' ? (
        <Card glow className="p-8 text-center space-y-4 border-emerald-500/40 bg-emerald-950/10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Your Identity is Verified!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You have full access to high-volume crypto withdrawals and tier-1 gift card trade execution rates.
          </p>
        </Card>
      ) : (
        <Card className="p-6 border-slate-800 space-y-6">
          <form onSubmit={handleSubmitKYC} className="space-y-6">
            {/* Step 1: Select ID Document Type */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-wider text-slate-400">1. Select Document Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'PASSPORT', label: 'Passport', icon: '🛂' },
                  { type: 'DRIVERS_LICENSE', label: "Driver's License", icon: '🪪' },
                  { type: 'NATIONAL_ID', label: 'National ID Card', icon: '🆔' },
                ].map((doc) => (
                  <button
                    key={doc.type}
                    type="button"
                    onClick={() => setIdType(doc.type as any)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                      idType === doc.type
                        ? 'gradient-bg-purple text-white border-purple-400 shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{doc.icon}</span>
                    <span className="text-xs font-bold">{doc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Number */}
            <Input
              label="Document Identification Number"
              type="text"
              placeholder="e.g. Passport or License Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />

            {/* Step 2: Document & Selfie Uploaders */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-wider text-slate-400">2. Upload Verification Media</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Photo */}
                <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-4 text-center bg-slate-950/40">
                  {frontDoc ? (
                    <img src={frontDoc} alt="Document" className="w-full h-36 object-cover rounded-xl" />
                  ) : (
                    <label className="cursor-pointer space-y-2 block">
                      <FileCheck className="w-8 h-8 text-purple-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-200 block">Upload ID Front Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'front')} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Selfie Photo */}
                <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-4 text-center bg-slate-950/40">
                  {selfie ? (
                    <img src={selfie} alt="Selfie" className="w-full h-36 object-cover rounded-xl" />
                  ) : (
                    <label className="cursor-pointer space-y-2 block">
                      <Camera className="w-8 h-8 text-purple-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-200 block">Upload Selfie Holding ID</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'selfie')} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-purple-600/30"
              isLoading={isSubmitting}
              disabled={!idNumber || !frontDoc || !selfie}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit KYC Verification
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
