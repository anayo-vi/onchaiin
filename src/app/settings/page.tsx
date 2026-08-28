'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Phone, MapPin, CheckCircle2, Camera, Upload, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [avatar, setAvatar] = useState<string>('/profile-pic.jpeg');
  const [name, setName] = useState<string>('Leo Garcia Arthur');
  const [phone, setPhone] = useState<string>('+1 (505) 730-8886');
  const [address, setAddress] = useState<string>('123 Main Street, Apt 4B');
  const [city, setCity] = useState<string>('Albuquerque');
  const [state, setState] = useState<string>('New Mexico');
  const [zip, setZip] = useState<string>('87101');
  const [country, setCountry] = useState<string>('United States');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize initial state from live PostgreSQL database & session
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data?.success && data?.user) {
          const u = data.user;
          if (u.name) setName(u.name);
          if (u.avatar && !u.avatar.includes('unsplash.com')) {
            setAvatar(u.avatar);
          }
          if (u.profile) {
            if (u.profile.phone) setPhone(u.profile.phone);
            if (u.profile.address) setAddress(u.profile.address);
            if (u.profile.city) setCity(u.profile.city);
            if (u.profile.state) setState(u.profile.state);
            if (u.profile.zip) setZip(u.profile.zip);
            if (u.profile.country) setCountry(u.profile.country);
          }
        }
      } catch (err) {
        console.warn('Profile fetch fallback:', err);
      }
    }

    const storedAvatar = typeof window !== 'undefined' ? localStorage.getItem('user_avatar') : null;
    if (storedAvatar) {
      setAvatar(storedAvatar);
    } else if (user?.avatar && !user.avatar.includes('unsplash.com')) {
      setAvatar(user.avatar);
    }

    if (user?.name) setName(user.name);
    loadProfile();
  }, [user?.avatar, user?.name]);

  // Real-time Profile Picture File Upload Handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      // Instant local preview via Data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const localDataUrl = reader.result as string;
        
        // Immediately save user's uploaded picture locally so it never resets
        setAvatar(localDataUrl);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_avatar', localDataUrl);
        }

        try {
          // Upload to Supabase Storage bucket via /api/upload
          const formData = new FormData();
          formData.append('file', file);
          formData.append('bucket', 'avatars');

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();

          // Use server URL if valid and not an unsplash fallback
          const finalUrl = (data?.url && !data.url.includes('unsplash.com')) ? data.url : localDataUrl;
          
          setAvatar(finalUrl);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_avatar', finalUrl);
            window.dispatchEvent(new Event('storage'));
          }

          // Persist updated avatar and profile to PostgreSQL database permanently
          await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, avatar: finalUrl, phone, city, country }),
          });

          // Update NextAuth session with a lightweight URL (not raw base64) to prevent Vercel 494 Request Header Too Large
          const cookieSafeAvatar = finalUrl.startsWith('data:image') ? '/profile-pic.jpeg' : finalUrl;
          await update({
            name,
            avatar: cookieSafeAvatar,
          });

          console.log('✅ Real-time profile picture updated across session and database:', finalUrl);
        } catch (err) {
          console.warn('Real-time profile upload warning:', err);
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Real-time Form Save Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_avatar', avatar);
      }

      // Persist profile data to PostgreSQL database permanently
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar, phone, address, city, state, zip, country }),
      });

      const cookieSafeAvatar = avatar.startsWith('data:image') ? '/profile-pic.jpeg' : avatar;
      await update({
        name,
        avatar: cookieSafeAvatar,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving profile changes:', err);
    } finally {
      setIsSaving(false);
    }
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
          {/* Profile Picture Upload Card */}
          <Card glow className="p-6 border-[#2B2F36] bg-[#181A20]/90 backdrop-blur-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Profile Picture</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Circular Avatar Preview with Real-time Camera Overlay */}
              <div className="relative group cursor-pointer">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FCD535]/40 shadow-2xl transition-transform group-hover:scale-105"
                />
                <label
                  htmlFor="avatar-upload-input"
                  className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  ) : (
                    <Camera className="w-7 h-7 text-white drop-shadow-md" />
                  )}
                </label>
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Upload Action Details */}
              <div className="space-y-2.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h4 className="text-base font-extrabold text-white">{name}</h4>
                  <Badge variant="success" size="sm">KYC Verified</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Allowed formats: PNG, JPG, JPEG or WEBP (Max 50MB)
                </p>
                <label
                  htmlFor="avatar-upload-input"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-[#FCD535] bg-[#FCD535]/15 border border-[#FCD535]/30 px-4 py-2 rounded-xl hover:bg-[#FCD535]/25 cursor-pointer transition-all"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isUploading ? 'Uploading Image...' : 'Upload New Picture'}</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Account Details Form */}
          <Card className="p-6 border-[#2B2F36] space-y-6 bg-[#181A20]">
            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Profile settings & avatar updated in real time across the application!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-[#FCD535]" />}
                required
              />

              <Input
                label="Phone Number"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-[#FCD535]" />}
              />

              <Input
                label="Street Address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                />

                <Input
                  label="State / Province"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP / Postal Code"
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                />

                <Input
                  label="Country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#FCD535]" />}
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                isLoading={isSaving}
                className="mt-2 gradient-bg-blue text-[#0B0E11] font-extrabold shadow-lg shadow-[#FCD535]/25 py-3"
              >
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Security Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card className="p-5 border-[#2B2F36] space-y-4 bg-[#181A20]">
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
