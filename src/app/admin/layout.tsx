'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/Sidebar';
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  Percent, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileCheck, 
  BellRing, 
  Settings, 
  ClipboardList 
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/gift-cards/submissions', label: 'Submissions', icon: Gift },
    { href: '/admin/gift-cards/rates', label: 'Rates', icon: Percent },
    { href: '/admin/deposits', label: 'Deposits', icon: ArrowDownLeft },
    { href: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
    { href: '/admin/kyc', label: 'KYC', icon: FileCheck },
    { href: '/admin/broadcasts', label: 'Announcements', icon: BellRing },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/audit-logs', label: 'Audit', icon: ClipboardList },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Mobile Admin Scrollable Subnav Bar */}
      <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'gradient-bg-purple text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex gap-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
