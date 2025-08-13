import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { WalletProvider } from "@/components/wallet-provider"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SapaSafe - Secure African Savings',
  description: 'Time-locked savings in African currencies. Build wealth with discipline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
            <MobileNav />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
