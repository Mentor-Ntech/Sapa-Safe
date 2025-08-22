import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SimpleWalletProvider } from '@/components/simple-wallet-provider';

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
        <SimpleWalletProvider>
          {children}
        </SimpleWalletProvider>
      </body>
    </html>
  );
}
