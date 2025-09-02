import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ClientWalletProvider } from "@/components/client-wallet-provider"
import { NavProvider } from "@/components/nav-context"
import { ConditionalMobileNav } from "@/components/conditional-mobile-nav"
import { Toaster } from 'sonner';

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
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientWalletProvider>
          <NavProvider>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
              <ConditionalMobileNav />
            </div>
            <Toaster 
              position="top-center"
              richColors
              closeButton
              duration={4000}
            />
          </NavProvider>
        </ClientWalletProvider>
      </body>
    </html>
  );
}
