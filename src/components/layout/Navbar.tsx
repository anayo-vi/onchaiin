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

  // Real-time Avatar & Profile Sync
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
      ];

  // ── Public Pages Header (logo only) ──────────────────────────────
  if (isPublicPage) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-[#2B2F36] bg-[#181A20]/95 backdrop-blur-xl shadow-md">
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

  // ── Authenticated App Header ──────────────────────────────────────
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2B2F36] bg-[#181A20]/95 backdrop-blur-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between min-h-[84px] py-2">
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:opacity-90 transition-opacity flex items-center">
              <Logo size="md" />
            </Link>

            <nav className="hidden lg:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FCD535]/15 text-[#FCD535] border border-[#FCD535]/40 font-bold shadow-sm'
                        : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FCD535]' : ''}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Bell + User menu */}
          <div className="flex items-center space-x-3">
            <Link
              href="/notifications"
              className="relative p-2 rounded-xl text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/60 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#FCD535]" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F6465D] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#2B2F36]/60 transition-colors border border-[#2B2F36] hover:border-[#FCD535]/40"
              >
                <img
                  src={avatarUrl}
                  alt={user?.name || 'User'}
                  className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#FCD535]/50"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-extrabold text-[#EAECEF] line-clamp-1">
                    {user?.name || (isAdmin ? 'Platform Admin' : 'Leo Garcia Arthur')}
                  </span>
                  <span className="text-[10px] text-[#FCD535] font-mono font-bold capitalize">
                    {isAdmin ? 'Superuser Mode' : 'Account Active'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#848E9C]" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-[#181A20] rounded-2xl py-2 shadow-2xl border border-[#2B2F36] z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-[#2B2F36] space-y-1">
                    <p className="text-xs font-extrabold text-[#EAECEF] truncate">
                      {user?.name || (isAdmin ? 'Platform Security Admin' : 'Leo Garcia Arthur')}
                    </p>
                    <p className="text-[11px] text-[#848E9C] truncate">{user?.email || 'admin@onchaiin.com'}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant={isAdmin ? 'warning' : 'success'} size="sm">
                        {isAdmin ? 'Superuser Admin' : 'KYC Verified'}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-[#848E9C] hover:text-[#EAECEF] hover:bg-[#2B2F36]/60 font-semibold"
                  >
                    <User className="w-4 h-4 text-[#FCD535]" />
                    <span>Profile & Settings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-[#FCD535] hover:bg-[#2B2F36]/60 font-bold"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Executive Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-[#F6465D] hover:bg-[#F6465D]/10 text-left border-t border-[#2B2F36] mt-1 font-semibold"
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
