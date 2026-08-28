'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CreditCard, 
  Lock, 
  TrendingUp, 
  RefreshCw, 
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  // Calculator state
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCardType, setSelectedCardType] = useState<'PHYSICAL' | 'ECODE'>('PHYSICAL');
  const [amount, setAmount] = useState<number>(100);

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
  };

  const key = `${selectedBrand}-${selectedCardType}`;
  const ratePercentage = ratesMap[key] || 75.0;
  const estimatedPayout = ((amount * ratePercentage) / 100).toFixed(2);

  const brands = ['Apple', 'Amazon', 'Steam', 'Google Play', 'Visa', 'Vanilla', 'Razer Gold'];

  const cryptoTicker = [
    { symbol: 'BTC', price: '$96,420.50', change: '+3.42%', isUp: true },
    { symbol: 'ETH', price: '$3,480.12', change: '+2.18%', isUp: true },
    { symbol: 'USDT', price: '$1.00', change: '0.00%', isUp: true },
    { symbol: 'TRX', price: '$0.245', change: '+5.61%', isUp: true },
    { symbol: 'LTC', price: '$112.80', change: '-0.85%', isUp: false },
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl overflow-hidden">
        {/* Background Interlocking Spiral Chain Image with Transparency */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none rounded-3xl"
          style={{ backgroundImage: "url('/crypto_yellow_bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/60 via-[#0B0E11]/80 to-[#0B0E11] pointer-events-none rounded-3xl" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FCD535]/15 blur-[130px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <Badge variant="blue" size="md" className="py-1.5 px-4 shadow-lg shadow-[#FCD535]/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block text-[#FCD535]" /> Next-Gen Crypto & Gift Card Exchange
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
              Trade Digital Gift Cards For <span className="gradient-text-blue">Instant Crypto</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Convert Apple, Amazon, Steam, and Visa gift cards directly into Bitcoin, Ethereum, or USDT at industry-leading exchange rates with instant wallet credit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto px-10 shadow-xl shadow-[#5A9BFF]/30">
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">$14.8M+</p>
                <p className="text-xs text-slate-400">Total Traded</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">99.8%</p>
                <p className="text-xs text-slate-400">Approval Rate</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">&lt; 3 Mins</p>
                <p className="text-xs text-slate-400">Avg Settlement</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Hero Widget Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <Card glow className="relative border-[#FCD535]/30 bg-[#181A20]/80 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#FCD535]" />
                  <span className="text-sm font-bold text-[#EAECEF]">Live Rate Estimator</span>
                </div>
                <Badge variant="success" size="sm">Instant Quote</Badge>
              </div>

              {/* Brand Select Buttons */}
              <div className="space-y-2">
                <label className="text-xs text-[#848E9C] font-medium">Select Brand</label>
                <div className="flex flex-wrap gap-2">
                  {brands.slice(0, 4).map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedBrand === b
                          ? 'gradient-bg-blue text-[#0B0E11] shadow-md'
                          : 'bg-[#2B2F36] text-[#EAECEF] hover:bg-[#363A45]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Type Switch */}
              <div className="flex space-x-2 bg-[#1E2026] p-1 rounded-xl border border-[#2B2F36]">
                <button
                  onClick={() => setSelectedCardType('PHYSICAL')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCardType === 'PHYSICAL'
                      ? 'bg-[#FCD535] text-[#0B0E11] font-bold'
                      : 'text-[#848E9C] hover:text-[#EAECEF]'
                  }`}
                >
                  Physical Card ({selectedBrand === 'Apple' ? '85%' : '82%'})
                </button>
                <button
                  onClick={() => setSelectedCardType('ECODE')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedCardType === 'ECODE'
                      ? 'bg-[#FCD535] text-[#0B0E11] font-bold'
                      : 'text-[#848E9C] hover:text-[#EAECEF]'
                  }`}
                >
                  E-Code ({selectedBrand === 'Apple' ? '80%' : '78%'})
                </button>
              </div>

              {/* Amount Input Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#848E9C] font-medium">Card Value (USD)</span>
                  <span className="text-[#FCD535] font-bold">${amount} USD</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1000"
                  step="25"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-[#2B2F36] rounded-lg appearance-none cursor-pointer accent-[#FCD535]"
                />
              </div>

              {/* Calculated Payout Box */}
              <div className="p-4 rounded-xl bg-[#181A20] border border-[#FCD535]/30 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#FCD535] font-semibold uppercase tracking-wider">Estimated Payout</p>
                  <p className="text-2xl font-black text-white">{estimatedPayout} <span className="text-sm font-semibold text-[#0ECB81]">USDT</span></p>
                </div>
                <Link href="/gift-cards">
                  <Button size="sm" variant="primary">
                    Trade Now
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Live Market Ticker */}
      <section className="border-y border-[#2B2F36] bg-[#181A20] py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 min-w-[700px]">
          {cryptoTicker.map((coin) => (
            <div key={coin.symbol} className="flex items-center space-x-3 bg-[#1E2026] px-4 py-2 rounded-xl border border-[#2B2F36]">
              <span className="text-xs font-bold text-white">{coin.symbol}</span>
              <span className="text-xs text-[#848E9C] font-mono">{coin.price}</span>
              <span className={`text-xs font-semibold ${coin.isUp ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {coin.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="purple" size="sm">Built For Security & Speed</Badge>
          <h2 className="text-3xl font-bold text-white">Why Trade On <span className="gradient-text-purple">Onchaiin</span>?</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Institutional-grade security combined with lightning-fast gift card verification and payout engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverable className="space-y-4 border-[#2B2F36] bg-[#181A20]">
            <div className="w-12 h-12 rounded-xl bg-[#FCD535]/15 text-[#FCD535] flex items-center justify-center border border-[#FCD535]/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Automated Credit</h3>
            <p className="text-xs text-[#848E9C] leading-relaxed">
              Once your gift card submission passes verification, funds are immediately credited to your USDT or BTC wallet balance without delays.
            </p>
          </Card>

          <Card hoverable className="space-y-4 border-[#2B2F36] bg-[#181A20]">
            <div className="w-12 h-12 rounded-xl bg-[#0ECB81]/15 text-[#0ECB81] flex items-center justify-center border border-[#0ECB81]/30">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cold Storage Vaults</h3>
            <p className="text-xs text-[#848E9C] leading-relaxed">
              98% of user cryptocurrency balances are secured in multi-signature cold storage vaults with AES-256 military grade encryption.
            </p>
          </Card>

          <Card hoverable className="space-y-4 border-[#2B2F36] bg-[#181A20]">
            <div className="w-12 h-12 rounded-xl bg-[#FCD535]/15 text-[#FCD535] flex items-center justify-center border border-[#FCD535]/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Best Market Rates</h3>
            <p className="text-xs text-[#848E9C] leading-relaxed">
              We offer up to 90% payout rates for physical Visa/Vanilla cards and up to 85% for Apple and Steam cards with transparent fee structures.
            </p>
          </Card>
        </div>
      </section>

      {/* Workflow Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="purple" size="sm">Simple 3-Step Process</Badge>
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6 text-center space-y-4 border border-[#2B2F36] bg-[#181A20]">
            <div className="w-10 h-10 rounded-full gradient-bg-purple text-[#0B0E11] font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#FCD535]/30">
              1
            </div>
            <h3 className="text-base font-bold text-white">Select Brand & Value</h3>
            <p className="text-xs text-[#848E9C]">
              Choose your gift card brand, country of issue, card type, and total card denomination.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center space-y-4 border border-[#2B2F36] bg-[#181A20]">
            <div className="w-10 h-10 rounded-full gradient-bg-purple text-[#0B0E11] font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#FCD535]/30">
              2
            </div>
            <h3 className="text-base font-bold text-white">Upload Front & Back Image</h3>
            <p className="text-xs text-[#848E9C]">
              Snap clear images of your gift card code and PIN for automated and admin review verification.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center space-y-4 border border-[#2B2F36] bg-[#181A20]">
            <div className="w-10 h-10 rounded-full gradient-bg-purple text-[#0B0E11] font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-[#FCD535]/30">
              3
            </div>
            <h3 className="text-base font-bold text-white">Receive Crypto Payout</h3>
            <p className="text-xs text-[#848E9C]">
              Funds are instantly credited to your wallet balance. Withdraw to any external address anytime!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card glow className="p-10 text-center space-y-6 border-purple-500/40 gradient-bg-purple/10">
          <h2 className="text-3xl font-black text-white">Ready To Turn Gift Cards Into Crypto?</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Join thousands of traders worldwide using Onchaiin for secure crypto storage and instant gift card payouts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" variant="primary" className="px-10 shadow-xl shadow-purple-600/40">
                <span>Login to Account</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
