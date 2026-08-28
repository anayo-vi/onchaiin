'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Gift, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileCheck, 
  Percent, 
  BellRing, 
  Settings, 
  ClipboardList 
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users Management', icon: Users },
    { href: '/admin/gift-cards/submissions', label: 'Gift Card Submissions', icon: Gift },
    { href: '/admin/gift-cards/rates', label: 'Exchange Rates Matrix', icon: Percent },
    { href: '/admin/deposits', label: 'Crypto Deposits', icon: ArrowDownLeft },
    { href: '/admin/withdrawals', label: 'Crypto Withdrawals', icon: ArrowUpRight },
    { href: '/admin/kyc', label: 'KYC Reviews', icon: FileCheck },
    { href: '/admin/broadcasts', label: 'Announcements', icon: BellRing },
    { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-[#181A20] rounded-2xl p-4 border border-[#2B2F36] hidden lg:block space-y-6 h-fit sticky top-24">
      <div className="px-3 py-2 border-b border-[#2B2F36]">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#FCD535]">Admin Control Center</h3>
        <p className="text-[11px] text-[#848E9C]">Superuser Operations</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'gradient-bg-blue text-[#0B0E11] shadow-md shadow-[#FCD535]/20 font-bold'
                  : 'text-[#848E9C] hover:bg-[#2B2F36]/60 hover:text-[#EAECEF]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
