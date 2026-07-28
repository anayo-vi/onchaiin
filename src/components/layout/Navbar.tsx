'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Wallet, 
  Gift, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell, 
  User, 
  ShieldAlert,
  ArrowRightLeft,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [avatarUrl, setAvatarUrl] = useState<string>('/profile-pic.jpeg');

  // Real-time Avatar Sync across all components
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
    return () => window.removeEventListener('storage', syncAvatar);
  }, [user?.avatar]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Gift Cards', href: '/gift-cards', icon: Gift },
    { name: 'KYC', href: '/kyc', icon: FileText },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin Control', href: '/admin', icon: ShieldAlert });
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1220]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <img
            src="/icon-new.png"
            alt="OnChaiin Logo"
            className="w-8 h-8 rounded-xl logo-float transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-[#6EB7FF] transition-colors">
              OnChaiin
            </span>
          </div>
        </Link>

        {/* Main Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'gradient-bg-blue text-[#0B1220] shadow-md shadow-[#5A9BFF]/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Right Menu & Notifications */}
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              {/* Notification Bell */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              {/* User Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#1C2B4A]/60 transition-colors border border-transparent hover:border-slate-700/60"
                >
                  <img
                    src={avatarUrl}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#6EB7FF]/40"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-100 line-clamp-1">
                      {user?.name || user?.email}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">
                      {user?.role || 'USER'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-[#16223B] rounded-2xl py-2 shadow-2xl border border-slate-700 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-700/80">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      href="/settings"
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700/50 hover:text-white"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-[#6EB7FF]" />
                      <span>Profile & Settings</span>
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-purple-400 hover:bg-slate-700/50 hover:text-purple-300 font-bold"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/login' })}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium text-left border-t border-slate-700/80 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-xs font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm" className="text-xs font-bold gradient-bg-blue text-[#0B1220]">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
