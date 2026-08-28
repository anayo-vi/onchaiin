'use client';

import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CryptoCurrency } from '@/types';

export default function DepositPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('USDT');
  const [network, setNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  const addresses: Record<string, string> = {
    USDT: network === 'TRC20' ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    BTC: 'bc1q9x0y2p3w4e5r6t7y8u9i0o1p2a3s4d5f6g7h8j',
    ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    TRX: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
    LTC: 'LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  };

  const depositAddress = addresses[selectedCurrency];

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateDeposit = () => {
    setIsSimulating(true);
    setSimulatedSuccess(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Deposit Cryptocurrency</h1>
        <p className="text-xs text-slate-400">Select your preferred cryptocurrency and network to generate a unique deposit address</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="md:col-span-7 space-y-6">
          <Card className="p-6 border-[#2B2F36] space-y-6 bg-[#181A20]">
            {/* Step 1: Select Crypto */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#848E9C]">1. Select Asset</label>
              <div className="grid grid-cols-5 gap-2">
                {(['USDT', 'BTC', 'ETH', 'TRX', 'LTC'] as CryptoCurrency[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCurrency(c)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${
                      selectedCurrency === c
                        ? 'gradient-bg-purple text-[#0B0E11] shadow-lg shadow-[#FCD535]/25'
                        : 'bg-[#1E2026] border border-[#2B2F36] text-[#EAECEF] hover:bg-[#2B2F36]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Network Selector for USDT */}
            {selectedCurrency === 'USDT' && (
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[#848E9C]">Network</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setNetwork('TRC20')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      network === 'TRC20'
                        ? 'border-[#FCD535] bg-[#FCD535]/15 text-[#FCD535]'
                        : 'border-[#2B2F36] bg-[#1E2026] text-[#848E9C]'
                    }`}
                  >
                    TRON (TRC20)
                  </button>
                  <button
                    onClick={() => setNetwork('ERC20')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      network === 'ERC20'
                        ? 'border-[#FCD535] bg-[#FCD535]/15 text-[#FCD535]'
                        : 'border-[#2B2F36] bg-[#1E2026] text-[#848E9C]'
                    }`}
                  >
                    Ethereum (ERC20)
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Deposit Address */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[#848E9C]">2. Deposit Address</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={depositAddress}
                  className="glass-input w-full rounded-xl px-4 py-3 text-xs font-mono text-[#FCD535]"
                />
                <Button
                  onClick={handleCopy}
                  variant={copied ? 'success' : 'secondary'}
                  size="md"
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Important Warning Alert */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-amber-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Send only <strong className="text-white">{selectedCurrency}</strong> to this address. Sending any other asset may result in permanent loss. Requires 3 network confirmations.
              </p>
            </div>

            {/* Simulation Sandbox Button */}
            <div className="pt-2 border-t border-[#2B2F36]">
              <Button
                onClick={handleSimulateDeposit}
                variant="outline"
                size="md"
                className="w-full border-dashed border-[#FCD535]/40 text-[#FCD535]"
                isLoading={isSimulating}
                leftIcon={<Sparkles className="w-4 h-4 text-[#FCD535]" />}
              >
                Simulate Instant Deposit (Dev Sandbox)
              </Button>
              {simulatedSuccess && (
                <p className="text-xs text-[#0ECB81] text-center mt-2 font-semibold">
                  ✓ Mock Deposit of 500 {selectedCurrency} credited to your wallet balance!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Right QR Code Column */}
        <div className="md:col-span-5 space-y-6">
          <Card glow className="p-6 text-center space-y-4 border-[#2B2F36] bg-[#181A20]">
            <div className="flex items-center justify-center space-x-2">
              <QrCode className="w-5 h-5 text-[#FCD535]" />
              <span className="text-sm font-bold text-white">Scan QR Code</span>
            </div>

            {/* Simulated QR Code Canvas Box */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#FCD535]/40">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(depositAddress)}`}
                alt="Deposit QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[11px] text-[#848E9C]">Scan with your mobile wallet app (Metamask, TrustWallet, Binance)</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
