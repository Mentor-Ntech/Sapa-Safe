import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { MinimalProvider } from "@/components/minimal-provider"
import { NavProvider } from "@/components/nav-context"
import { ConditionalMobileNav } from "@/components/conditional-mobile-nav"
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SapaSafe - Secure African Savings',
  description: 'Time-locked savings in African currencies. Build wealth with discipline.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MinimalProvider>
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
        </MinimalProvider>
      </body>
    </html>
  );
}
