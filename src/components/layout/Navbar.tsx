'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  Wallet, 
  Gift, 
  FileCheck, 
  ShieldAlert,
  Settings
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

  // Public landing/auth pages where standard clean header is displayed
  const isPublicPage = pathname === '/' || pathname === '/auth/login' || pathname.startsWith('/auth/');

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

  const navLinks = isAdmin
    ? [
        { href: '/dashboard', label: 'Admin Dashboard', icon: ShieldAlert },
        { href: '/admin/users', label: 'User Management', icon: User },
        { href: '/admin/kyc', label: 'KYC & Assets', icon: FileCheck },
        { href: '/admin/settings', label: 'Fee Settings', icon: Settings },
        { href: '/settings', label: 'Admin Profile', icon: User },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/wallet', label: 'Wallet', icon: Wallet },
        { href: '/gift-cards', label: 'Gift Cards', icon: Gift },
        { href: '/kyc', label: 'KYC', icon: FileCheck },
      ];

  // ---------------------------------------------------------------------
  // 1. PUBLIC PAGES HEADER (Home page "/" & Login page "/auth/login")
  // Displays normal clean header with centered logo
  // ---------------------------------------------------------------------
  if (isPublicPage) {
    return (
      <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-[#111A2E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-center min-h-[100px] py-1">
            <Link href="/" className="hover:opacity-90 transition-opacity flex items-center justify-center my-auto">
              <Logo size="md" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // ---------------------------------------------------------------------
  // 2. AUTHENTICATED INTERNAL APP HEADER (/dashboard, /wallet, /admin, etc.)
  // Displays navigation links, centered logo, and user dropdown menu
  // ---------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-[#111A2E]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between min-h-[100px] py-1">
          {/* Left Navigation Links (Desktop Left Side) */}
          {session ? (
            <nav className="hidden md:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
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
          ) : (
            <div className="hidden md:block w-32" />
          )}

          {/* Centered Brand Logo */}
          <Link href={session ? '/dashboard' : '/'} className="hover:opacity-90 transition-opacity flex items-center justify-center my-auto">
            <Logo size="md" />
          </Link>

          {/* Right Controls */}
          {session ? (
            <div className="flex items-center space-x-3">
              {/* Notifications Button */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1C2B4A]/60 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
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
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <Badge variant={user?.kycStatus === 'APPROVED' ? 'success' : 'warning'} size="sm">
                          {user?.kycStatus === 'APPROVED' ? 'KYC Verified' : 'Unverified'}
                        </Badge>
                      </div>
                    </div>

                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-[#1C2B4A]/60"
                    >
                      <Settings className="w-4 h-4 text-[#6EB7FF]" />
                      <span>Profile & Settings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-[#1C2B4A]/60 font-bold"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/login' })}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-left border-t border-slate-800/80 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:block w-32" />
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
