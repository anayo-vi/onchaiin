'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid credentials. Please check username/email and password.');
        setIsLoading(false);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Base Background: Interlocking Crypto Spiral Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transform scale-105"
        style={{ backgroundImage: "url('/crypto_yellow_bg.png')" }}
      />
      {/* Dark Overlay for Ultra-Glass Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/85 via-[#0B0E11]/70 to-[#0B0E11]/90 backdrop-blur-[2px] pointer-events-none" />

      {/* Radial Yellow Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FCD535]/15 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphic Dialog Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#181A20]/90 backdrop-blur-3xl border border-[#2B2F36] shadow-2xl shadow-[#FCD535]/10 space-y-6 relative overflow-hidden">
          {/* Top Yellow Glow Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FCD535] via-[#F0B90B] to-[#D99B00]" />

          {/* Secure Access Portal Header */}
          <div className="text-center space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EAECEF] font-sans drop-shadow-md">
              Secure Access Portal
            </h1>

            {/* Centered Circular Avatar Badge */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FCD535]/35 blur-lg animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-[#1E2026] border-2 border-[#FCD535]/60 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <User className="w-12 h-12 text-[#FCD535] drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-[#F6465D]/15 border border-[#F6465D]/40 flex items-center space-x-2.5 text-[#F6465D] text-xs font-semibold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#848E9C]">
                Username / Email Address
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#848E9C] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="admin or customer username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1E2026] border border-[#2B2F36] rounded-2xl pl-10 pr-4 py-3.5 text-sm text-[#EAECEF] placeholder:text-[#848E9C] focus:outline-none focus:border-[#FCD535] focus:ring-2 focus:ring-[#FCD535]/30 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#848E9C]">
                Account Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#848E9C] absolute left-4 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1E2026] border border-[#2B2F36] rounded-2xl pl-10 pr-11 py-3.5 text-sm text-[#EAECEF] placeholder:text-[#848E9C] focus:outline-none focus:border-[#FCD535] focus:ring-2 focus:ring-[#FCD535]/30 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#848E9C] hover:text-[#EAECEF] transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              className="w-full py-4 text-sm font-bold gradient-bg-blue text-[#0B0E11] shadow-xl shadow-[#FCD535]/25 hover:opacity-95 active:scale-[0.99] transition-all rounded-2xl border border-white/10"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Footer Security Badge */}
          <div className="pt-2 text-center border-t border-[#2B2F36] flex items-center justify-center space-x-2 text-[11px] text-[#848E9C]">
            <ShieldCheck className="w-4 h-4 text-[#0ECB81]" />
            <span>Encrypted Session • Cold Storage Protection</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
