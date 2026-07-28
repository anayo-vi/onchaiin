import React from 'react';
import Link from 'next/link';
import { Lock, Cpu, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-navy-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Logo size="md" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise cryptocurrency wallet ecosystem and instant digital gift card trading engine with cold storage custody and instant settlement.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Supported Crypto</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span>Bitcoin (BTC)</span></li>
            <li className="flex items-center space-x-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-500"></span><span>Ethereum (ETH)</span></li>
            <li className="flex items-center space-x-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Tether (USDT TRC20/ERC20)</span></li>
            <li className="flex items-center space-x-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span>TRON (TRX)</span></li>
            <li className="flex items-center space-x-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-sky-500"></span><span>Litecoin (LTC)</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Gift Card Trading</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/gift-cards" className="hover:text-purple-400">Apple Store & iTunes</Link></li>
            <li><Link href="/gift-cards" className="hover:text-purple-400">Amazon Gift Cards</Link></li>
            <li><Link href="/gift-cards" className="hover:text-purple-400">Steam Wallet Code</Link></li>
            <li><Link href="/gift-cards" className="hover:text-purple-400">Google Play Store</Link></li>
            <li><Link href="/gift-cards" className="hover:text-purple-400">Visa / Vanilla Prepaid</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Security & Compliance</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>256-bit AES Vault Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Automated Settlement Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Multi-Region KYC Compliance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Onchaiin Platform Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="#" className="hover:text-slate-300">Security Audit</Link>
        </div>
      </div>
    </footer>
  );
};
