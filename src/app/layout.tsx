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
    icon: '/new_icon.png',
    shortcut: '/new_icon.png',
    apple: '/new_icon.png',
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
      <body className="bg-[#0B0E11] text-[#EAECEF] min-h-screen flex flex-col antialiased selection:bg-[#FCD535] selection:text-[#0B0E11] pb-16 md:pb-0">
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
