'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the terms of service');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/auth/login?registered=true');
      }
    } catch (err: any) {
      setError('Registration error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl gradient-bg-purple items-center justify-center shadow-lg shadow-purple-600/30 mb-2">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Free Account</h1>
          <p className="text-xs text-slate-400">Join OnChaiin to manage wallets & trade gift cards</p>
        </div>

        <Card className="p-6 space-y-5 border-slate-800">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the <span className="text-purple-400 underline">Terms of Service</span> & <span className="text-purple-400 underline">Privacy Policy</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-purple-600/30"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/auth/login" className="text-purple-400 font-semibold hover:underline">
            Sign In instead
          </Link>
        </p>
      </div>
    </div>
  );
}
