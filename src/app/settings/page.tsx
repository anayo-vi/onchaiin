'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Phone, MapPin, CheckCircle2, Camera, Upload, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [avatar, setAvatar] = useState(user?.avatar || '/profile-pic.jpeg');
  const [name, setName] = useState(user?.name || 'Leo Garcia Arthur');
  const [phone, setPhone] = useState('+1 (555) 392-1092');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('New Mexico');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Profile & Account Settings</h1>
        <p className="text-xs text-slate-400">Manage personal details, profile picture, security credentials, and contact preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Main Settings Form */}
        <div className="md:col-span-8 space-y-6">
          {/* Profile Picture Placeholder Card */}
          <Card glow className="p-6 border-slate-800 bg-[#111A2E]/90 backdrop-blur-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Profile Picture</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Circular Avatar Preview with Camera Icon */}
              <div className="relative group cursor-pointer">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#6EB7FF]/40 shadow-2xl transition-transform group-hover:scale-105"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  <Camera className="w-7 h-7 text-white drop-shadow-md" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Upload Action Details */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h4 className="text-base font-extrabold text-white">{name}</h4>
                  <Badge variant="success" size="sm">KYC Verified</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Allowed formats: PNG, JPG, JPEG or WEBP (Max 5MB)
                </p>
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-[#6EB7FF] bg-[#6EB7FF]/15 border border-[#6EB7FF]/30 px-4 py-2 rounded-xl hover:bg-[#6EB7FF]/25 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Picture</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Account Details Form */}
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
                  label="City / State"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="mt-2 gradient-bg-blue text-[#0B1220] font-bold shadow-lg shadow-[#5A9BFF]/25">
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Security Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card className="p-5 border-slate-800 space-y-4 bg-[#111A2E]/80">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Account Security</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Two-Factor Auth</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">KYC Status</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Password</span>
                <button type="button" className="text-[#6EB7FF] hover:underline font-semibold">Change</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
