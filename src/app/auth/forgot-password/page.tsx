'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-xs text-slate-400">Enter your email to receive password reset instructions</p>
        </div>

        <Card className="p-6 space-y-5 border-slate-800">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Reset Link Sent</h3>
              <p className="text-xs text-slate-400">
                We have sent password reset instructions to <span className="text-slate-200 font-semibold">{email}</span>.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </Card>

        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center text-xs text-purple-400 hover:underline space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
