'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 text-center space-y-5 border-slate-800">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Email Verified!</h1>
          <p className="text-xs text-slate-400">
            Your email address has been successfully verified on OnChaiin. Your account is fully active.
          </p>
        </div>

        <Link href="/dashboard" className="block pt-2">
          <Button variant="primary" size="lg" className="w-full">
            Go to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
}
