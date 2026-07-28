'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Wallet, 
  Gift, 
  FileCheck, 
  User,
  ShieldAlert
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user as any;
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/gift-cards', label: 'Trade', icon: Gift },
    { href: '/kyc', label: 'KYC', icon: FileCheck },
    { href: isAdmin ? '/admin' : '/settings', label: isAdmin ? 'Admin' : 'Profile', icon: isAdmin ? ShieldAlert : User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card bg-[#111A2E]/95 border-t border-slate-800/90 backdrop-blur-2xl px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#6EB7FF] font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#6EB7FF]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
