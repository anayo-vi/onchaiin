'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Wallet, 
  Gift, 
  ReceiptText,
  User,
  ShieldAlert
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user as any;
  const isAdmin = user?.role === 'ADMIN';

  const navItems = isAdmin
    ? [
        { href: '/admin', label: 'Overview', icon: ShieldAlert },
        { href: '/admin/users', label: 'Users', icon: User },
        { href: '/admin/gift-cards/submissions', label: 'Gift Cards', icon: Gift },
        { href: '/admin/kyc', label: 'KYC', icon: ReceiptText },
        { href: '/settings', label: 'Profile', icon: User },
      ]
    : [
        { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { href: '/wallet', label: 'Wallet', icon: Wallet },
        { href: '/gift-cards', label: 'Trade', icon: Gift },
        { href: '/transactions', label: 'History', icon: ReceiptText },
        { href: '/settings', label: 'Profile', icon: User },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D0DCEA] shadow-lg backdrop-blur-xl px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#1A4880] font-bold scale-105'
                  : 'text-[#7A95B4] hover:text-[#3A5272]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563AB]' : 'text-[#7A95B4]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
