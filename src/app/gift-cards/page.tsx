'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function GiftCardsPage() {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [cardType, setCardType] = useState<'PHYSICAL' | 'ECODE'>('PHYSICAL');
  const [denomination, setDenomination] = useState<string>('100');
  const [cardCode, setCardCode] = useState('');
  const [pin, setPin] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const brands = [
    { name: 'Apple', icon: '🍎', color: 'border-slate-700' },
    { name: 'Amazon', icon: '📦', color: 'border-amber-500/40' },
    { name: 'Steam', icon: '🎮', color: 'border-indigo-500/40' },
    { name: 'Google Play', icon: '▶️', color: 'border-emerald-500/40' },
    { name: 'Visa', icon: '💳', color: 'border-sky-500/40' },
    { name: 'Vanilla', icon: '🍦', color: 'border-rose-500/40' },
    { name: 'Razer Gold', icon: '🐍', color: 'border-emerald-400/40' },
    { name: 'Nike', icon: '✔️', color: 'border-slate-500' },
    { name: 'Sephora', icon: '💄', color: 'border-pink-500/40' },
    { name: 'eBay', icon: '🛍️', color: 'border-blue-500/40' },
  ];

  const ratesMap: Record<string, number> = {
    'Apple-PHYSICAL': 85.0,
    'Apple-ECODE': 80.0,
    'Amazon-PHYSICAL': 82.0,
    'Amazon-ECODE': 78.0,
    'Steam-PHYSICAL': 88.0,
    'Steam-ECODE': 84.0,
    'Google Play-PHYSICAL': 79.0,
    'Google Play-ECODE': 74.0,
    'Visa-PHYSICAL': 90.0,
    'Vanilla-PHYSICAL': 87.0,
    'Razer Gold-ECODE': 86.0,
    'Nike-PHYSICAL': 75.0,
    'Sephora-PHYSICAL': 76.0,
    'eBay-ECODE': 81.0,
  };

  const key = `${selectedBrand}-${cardType}`;
  const ratePercentage = ratesMap[key] || 75.0;
  const numDenomination = parseFloat(denomination) || 0;
  const calculatedPayout = ((numDenomination * ratePercentage) / 100).toFixed(2);

  const submissions = [
    {
      id: 'GC-SUB-88120',
      brand: 'Apple',
      country: 'US',
      cardType: 'PHYSICAL',
      denomination: 500.0,
      ratePercentage: 85.0,
      calculatedPayout: 425.0,
      status: 'APPROVED',
      date: '2026-07-26 14:12',
    },
    {
      id: 'GC-SUB-99102',
      brand: 'Amazon',
      country: 'US',
      cardType: 'ECODE',
      denomination: 200.0,
      ratePercentage: 78.0,
      calculatedPayout: 156.0,
      status: 'PENDING',
      date: '2026-07-27 18:45',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'front') setFrontImage(reader.result as string);
        else setBackImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessNotice(true);
      setDenomination('100');
      setCardCode('');
      setPin('');
      setFrontImage(null);
      setBackImage(null);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Sell Gift Cards for Crypto</h1>
        <p className="text-xs text-slate-400">Convert unused digital or physical gift cards directly into USDT or BTC balance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Submission Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 border-slate-800 space-y-6">
            {successNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-white">Trade Submitted Successfully!</p>
                  <p className="text-slate-300">Admin is verifying your card images. Payout will be credited upon approval.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitTrade} className="space-y-6">
              {/* Step 1: Select Brand */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-slate-400">1. Select Card Brand</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {brands.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setSelectedBrand(b.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                        selectedBrand === b.name
                          ? 'gradient-bg-blue text-[#0B0E11] font-bold shadow-lg border-[#FCD535]'
                          : 'bg-[#181A20] border-[#2B2F36] text-[#EAECEF] hover:border-[#363A45]'
                      }`}
                    >
                      <span className="text-xl">{b.icon}</span>
                      <span className="text-xs font-bold">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Country & Type & Denomination */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-400">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="glass-input w-full rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="US">United States (USD)</option>
                    <option value="UK">United Kingdom (GBP)</option>
                    <option value="EUR">Europe (EUR)</option>
                    <option value="CA">Canada (CAD)</option>
                    <option value="GLOBAL">Global / Worldwide</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-400">Card Format</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value as any)}
                    className="glass-input w-full rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="PHYSICAL">Physical Card (Plastic)</option>
                    <option value="ECODE">E-Code / Digital Voucher</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-400">Denomination ($)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                    className="glass-input w-full rounded-xl px-4 py-3 text-xs font-mono text-slate-100 focus:outline-none"
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              {/* Step 3: Card Code & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Card Code / Serial (Optional)"
                  type="text"
                  placeholder="e.g. X9928-10923-88219"
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                />
                <Input
                  label="PIN / Security Code (Optional)"
                  type="text"
                  placeholder="e.g. 4920"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              {/* Step 4: Card Image Uploaders */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-slate-400">Card Image Uploads</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Image Uploader */}
                  <div className="relative border-2 border-dashed border-slate-700 hover:border-[#6EB7FF]/60 rounded-2xl p-4 text-center bg-[#0B1220]/60 transition-colors">
                    {frontImage ? (
                      <div className="relative group">
                        <img src={frontImage} alt="Front preview" className="w-full h-32 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => setFrontImage(null)}
                          className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-2 block">
                        <Upload className="w-6 h-6 text-[#6EB7FF] mx-auto" />
                        <span className="text-xs font-bold text-slate-200 block">Upload Card Front</span>
                        <span className="text-[10px] text-slate-400 block">PNG, JPG up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'front')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Back Image Uploader */}
                  <div className="relative border-2 border-dashed border-slate-700 hover:border-[#6EB7FF]/60 rounded-2xl p-4 text-center bg-[#0B1220]/60 transition-colors">
                    {backImage ? (
                      <div className="relative group">
                        <img src={backImage} alt="Back preview" className="w-full h-32 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => setBackImage(null)}
                          className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-2 block">
                        <Upload className="w-6 h-6 text-[#6EB7FF] mx-auto" />
                        <span className="text-xs font-bold text-slate-200 block">Upload Card Back</span>
                        <span className="text-[10px] text-slate-400 block">PNG, JPG up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'back')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-xl shadow-[#5A9BFF]/30"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Trade for {calculatedPayout} USDT
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Live Calculator & Submissions Bar */}
        <div className="lg:col-span-4 space-y-6">
          <Card glow className="p-6 border-[#6EB7FF]/30 space-y-5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#6EB7FF]" />
              <h3 className="text-sm font-bold text-white">Live Rate Summary</h3>
          <Card glow className="p-6 border-[#FCD535]/30 space-y-5 bg-[#181A20]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#FCD535]" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#2B2F36]">
                <span className="text-[#848E9C]">Card Brand</span>
                <span className="font-bold text-[#EAECEF]">{selectedBrand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2B2F36]">
                <span className="text-[#848E9C]">Exchange Rate</span>
                <span className="font-bold text-[#0ECB81]">{ratePercentage}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2B2F36]">
                <span className="text-[#848E9C]">Input Value</span>
                <span className="font-mono font-bold text-[#EAECEF]">${numDenomination} USD</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1E2026] border border-[#FCD535]/30 flex justify-between items-center text-sm font-bold text-white">
                <span className="text-[#848E9C] text-xs">Estimated Payout</span>
                <span className="text-lg font-mono text-[#FCD535]">{calculatedPayout} USDT</span>
              </div>
            </div>
          </Card>

          {/* Submissions Tracker */}
          <Card className="p-6 border-[#2B2F36] bg-[#181A20] space-y-4">
            <h3 className="text-sm font-bold text-white">Your Trade Submissions</h3>

            <div className="space-y-3 text-xs">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-[#111A2E]/80 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sub.brand} (${sub.denomination})</span>
                    <Badge variant={sub.status === 'APPROVED' ? 'success' : 'warning'} size="sm">
                      {sub.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Payout: {sub.calculatedPayout} USDT</span>
                    <span>{sub.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
