'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Phone, MapPin, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [phone, setPhone] = useState('+1 (555) 839-2019');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('San Francisco');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Profile & Account Settings</h1>
        <p className="text-xs text-slate-400">Manage personal details, security credentials, and contact preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <Card className="p-6 border-slate-800 space-y-6">
            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Phone Number"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <Input
                  label="City"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="mt-2">
                Save Changes
              </Button>
            </form>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="p-5 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Account Security</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Two-Factor Auth</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Password</span>
                <button className="text-purple-400 hover:underline font-semibold">Change</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
