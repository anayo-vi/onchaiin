'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
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
        setError(res.error || 'Invalid username or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An authentication error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Base Background: Interlocking Crypto Spiral Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transform scale-105"
        style={{ backgroundImage: "url('/crypto_spiral_bg.png')" }}
      />
      {/* Dark Overlay for Ultra-Glass Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/80 via-[#111A2E]/65 to-[#0B1220]/85 backdrop-blur-[2px] pointer-events-none" />

      {/* Radial Blue Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6EB7FF]/20 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphic Dialog Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#111A2E]/40 backdrop-blur-3xl border border-white/20 shadow-2xl shadow-[#6EB7FF]/15 space-y-6 relative overflow-hidden">
          {/* Subtle Top Metallic Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7BC2FF] via-[#5A9BFF] to-[#38BDF8]" />

          {/* Secure Access Portal Header */}
          <div className="text-center space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans drop-shadow-md">
              Secure Access Portal
            </h1>

            {/* Centered Circular Avatar Badge */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#6EB7FF]/35 blur-lg animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-[#1C2B4A]/90 to-[#0B1220]/90 border-2 border-[#6EB7FF]/60 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <User className="w-12 h-12 text-[#7BC2FF] drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 backdrop-blur-md flex items-center space-x-3 text-rose-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username or Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Username or Email
              </label>
              <input
                type="text"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B1220]/75 border border-white/20 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#7BC2FF] focus:ring-2 focus:ring-[#7BC2FF]/40 backdrop-blur-xl transition-all font-medium"
                required
              />
            </div>

            {/* Password Input with Eye Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B1220]/75 border border-white/20 rounded-2xl pl-4 pr-11 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#7BC2FF] focus:ring-2 focus:ring-[#7BC2FF]/40 backdrop-blur-xl transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-4 text-sm font-bold gradient-bg-blue text-[#0B1220] shadow-xl shadow-[#5A9BFF]/35 hover:opacity-95 active:scale-[0.99] transition-all rounded-2xl border border-white/20"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Login to Onchaiin
            </Button>
          </form>

          {/* Links */}
          <div className="text-center space-y-2.5 pt-3 border-t border-white/10">
            <div>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-slate-300 hover:text-[#7BC2FF] transition-colors underline underline-offset-4"
              >
                Forgot Password?
              </Link>
            </div>
            <div>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-bold text-[#7BC2FF] hover:underline transition-colors"
              >
                Need Help Accessing Account?
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
