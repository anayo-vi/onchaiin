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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Available balance in Dollars ($ USD)
  const availableBalanceUSD = 70000000.00;
  const minWithdrawalUSD = 100.00;
  const feeUSD = 2500.00; // Standard $2,500 withdrawal fee

  const numAmount = parseFloat(amount) || 0;
  const netAmount = Math.max(0, numAmount - feeUSD);

  const handleMax = () => {
    setAmount(availableBalanceUSD.toString());
  };

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < minWithdrawalUSD) return;
    if (numAmount > availableBalanceUSD) return;
    setIsModalOpen(true);
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
      setPassword('');
    }, 1500);
  };

  const isFormValid =
    payoutMethod === 'BANK_WIRE'
      ? numAmount > 0 && numAmount <= availableBalanceUSD && fullName && bankName && routingNumber && address && dob
      : numAmount > 0 && numAmount <= availableBalanceUSD && usdtAddress;

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
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-white">Withdrawal Request Submitted!</p>
                  <p className="text-slate-300">Your dollar withdrawal is currently PENDING review by the security team.</p>
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
                  <span>Processing Fee:</span>
                  <span className="font-mono text-amber-400 font-bold">$2,500.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-100 font-bold border-t border-slate-800/80 pt-2 text-sm">
                  <span>Net Amount Received:</span>
                  <span className="font-mono text-emerald-400">${netAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
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
              <span>Instant Payout Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Dollar withdrawals carry a standard $2,500.00 USD processing fee per transaction. Funds will reflect in your destination account within 5 to 15 minutes.
            </p>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Dollar Withdrawal"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 space-y-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Withdrawing:</span>
              <span className="text-xl font-mono font-black text-emerald-400">
                ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
            </div>

            {payoutMethod === 'BANK_WIRE' ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-slate-400">Beneficiary Name: <strong className="text-white">{fullName}</strong></p>
                <p className="text-slate-400">Bank Name: <strong className="text-white">{bankName}</strong></p>
                <p className="text-slate-400">Address: <strong className="text-white">{address}</strong></p>
                <p className="text-slate-400">Routing No: <strong className="text-white">{routingNumber}</strong></p>
                <p className="text-slate-400">Date of Birth: <strong className="text-white">{dob}</strong></p>
              </div>
            ) : (
              <div className="pt-1">
                <p className="text-slate-400">Destination USDT Address:</p>
                <p className="font-mono text-[#6EB7FF] truncate">{usdtAddress}</p>
              </div>
            )}
          </div>

          <Input
            label="Enter Account Password"
            type="password"
            placeholder="Confirm password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
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
              className="flex-1"
              isLoading={isSubmitting}
              disabled={!password}
              onClick={handleConfirmWithdrawal}
            >
              Confirm Payout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
