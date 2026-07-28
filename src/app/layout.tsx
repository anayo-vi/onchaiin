import type { Metadata, Viewport } from 'next';
import './globals.css';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'Onchaiin | Premium Crypto Wallet & Digital Gift Card Trading Platform',
  description: 'Trade digital gift cards for crypto instantly. Secure wallet storage for BTC, ETH, USDT, TRX, and LTC with institutional cold-storage security.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-purple-600 selection:text-white pb-16 md:pb-0">
        <NextAuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <MobileBottomNav />
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
