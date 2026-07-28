'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Wallet,
  Gift,
  FileCheck,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ShieldAlert,
  ReceiptText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [avatarUrl, setAvatarUrl] = useState<string>('/profile-pic.jpeg');

  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  // Homepage and all auth pages always show the clean logo-only header
  const isPublicPage = pathname === '/' || pathname === '/auth/login' || pathname.startsWith('/auth/');

  // Real-time Avatar & Profile Sync across all components and page refreshes/focus
  useEffect(() => {
    const syncAvatar = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('user_avatar') : null;
      if (stored) {
        setAvatarUrl(stored);
      } else if (user?.avatar) {
        setAvatarUrl(user.avatar);
      }
    };

    syncAvatar();
    window.addEventListener('storage', syncAvatar);
    window.addEventListener('focus', syncAvatar);
    return () => {
      window.removeEventListener('storage', syncAvatar);
      window.removeEventListener('focus', syncAvatar);
    };
  }, [user?.avatar]);

  const navLinks = isAdmin
    ? [
        { href: '/dashboard', label: 'Admin Dashboard', icon: ShieldAlert },
        { href: '/admin/users', label: 'User Management', icon: User },
        { href: '/admin/gift-cards/submissions', label: 'Gift Card Queue', icon: Gift },
        { href: '/admin/kyc', label: 'KYC & Assets', icon: FileCheck },
        { href: '/admin/settings', label: 'Fee Settings', icon: Settings },
        { href: '/settings', label: 'Admin Profile', icon: User },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/wallet', label: 'Wallet', icon: Wallet },
        { href: '/gift-cards', label: 'Gift Cards', icon: Gift },
        { href: '/transactions', label: 'History', icon: ReceiptText },
        { href: '/kyc', label: 'KYC', icon: FileCheck },
      ];

  // ---------------------------------------------------------------------
  // 1. UNAUTHENTICATED PUBLIC PAGES HEADER
  // Displays normal clean header with centered logo
  // ---------------------------------------------------------------------
  if (isPublicPage) {
    return (
      <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-[#111A2E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center min-h-[80px] py-1">
            <Link href="/" className="hover:opacity-90 transition-opacity flex items-center">
              <Logo size="md" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // ---------------------------------------------------------------------
  // 2. AUTHENTICATED INTERNAL APP HEADER FOR USER & ADMIN
  // Displays Logo on Left, Nav Links in Center/Left, User Menu on Right
  // ---------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-[#111A2E]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between min-h-[84px] py-2">
          {/* Left Side: Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:opacity-90 transition-opacity flex items-center">
              <Logo size="md" />
            </Link>

            {/* Navigation Links for Authenticated Session */}
            <nav className="hidden lg:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#6EB7FF]/15 text-[#6EB7FF] border border-[#6EB7FF]/40 shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-[#1C2B4A]/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Notifications & User Menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications Button */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1C2B4A]/60 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#6EB7FF]" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#1C2B4A]/60 transition-colors border border-slate-800/80 hover:border-[#6EB7FF]/40"
              >
                <img
                  src={avatarUrl}
                  alt={user?.name || 'User'}
                  className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#6EB7FF]/50"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-extrabold text-white line-clamp-1">
                    {user?.name || (isAdmin ? 'Platform Admin' : 'Leo Garcia Arthur')}
                  </span>
                  <span className="text-[10px] text-[#6EB7FF] font-mono font-bold capitalize">
                    {isAdmin ? 'Superuser Mode' : 'Account Active'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-[#16223B] rounded-2xl py-2 shadow-2xl border border-slate-700 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-800 space-y-1">
                    <p className="text-xs font-extrabold text-white truncate">
                      {user?.name || (isAdmin ? 'Platform Security Admin' : 'Leo Garcia Arthur')}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@onchaiin.com'}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant={isAdmin ? 'warning' : 'success'} size="sm">
                        {isAdmin ? 'Superuser Admin' : 'KYC Verified'}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-[#1C2B4A]/60 font-semibold"
                  >
                    <User className="w-4 h-4 text-[#6EB7FF]" />
                    <span>Profile & Settings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-[#1C2B4A]/60 font-bold"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Executive Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-left border-t border-slate-800/80 mt-1 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out Account</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
