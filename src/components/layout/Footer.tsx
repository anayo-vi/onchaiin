import React from 'react';
import Link from 'next/link';
import { Lock, Cpu, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#2B2F36] bg-[#181A20] text-[#848E9C] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Logo size="md" />
          <p className="text-xs text-[#848E9C] leading-relaxed">
            Enterprise cryptocurrency wallet ecosystem and instant digital gift card trading engine with cold storage custody and instant settlement.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#EAECEF] uppercase tracking-widest mb-4">Supported Crypto</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2 text-[#848E9C]"><span className="w-2 h-2 rounded-full bg-[#FCD535]"></span><span>Bitcoin (BTC)</span></li>
            <li className="flex items-center space-x-2 text-[#848E9C]"><span className="w-2 h-2 rounded-full bg-indigo-400"></span><span>Ethereum (ETH)</span></li>
            <li className="flex items-center space-x-2 text-[#848E9C]"><span className="w-2 h-2 rounded-full bg-[#0ECB81]"></span><span>Tether (USDT TRC20/ERC20)</span></li>
            <li className="flex items-center space-x-2 text-[#848E9C]"><span className="w-2 h-2 rounded-full bg-[#F6465D]"></span><span>TRON (TRX)</span></li>
            <li className="flex items-center space-x-2 text-[#848E9C]"><span className="w-2 h-2 rounded-full bg-sky-400"></span><span>Litecoin (LTC)</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#EAECEF] uppercase tracking-widest mb-4">Gift Card Trading</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/gift-cards" className="hover:text-[#FCD535] transition-colors">Apple Store & iTunes</Link></li>
            <li><Link href="/gift-cards" className="hover:text-[#FCD535] transition-colors">Amazon Gift Cards</Link></li>
            <li><Link href="/gift-cards" className="hover:text-[#FCD535] transition-colors">Steam Wallet Code</Link></li>
            <li><Link href="/gift-cards" className="hover:text-[#FCD535] transition-colors">Google Play Store</Link></li>
            <li><Link href="/gift-cards" className="hover:text-[#FCD535] transition-colors">Visa / Vanilla Prepaid</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#EAECEF] uppercase tracking-widest mb-4">Security & Compliance</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#0ECB81]" />
              <span>256-bit AES Vault Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#FCD535]" />
              <span>Automated Settlement Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Multi-Region KYC Compliance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[#2B2F36] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#848E9C]">
        <p>© {new Date().getFullYear()} Onchaiin Platform Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-[#EAECEF]">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#EAECEF]">Terms of Service</Link>
          <Link href="#" className="hover:text-[#EAECEF]">Security Audit</Link>
        </div>
      </div>
    </footer>
  );
};
