'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { AppProvider } from './wallet-provider';

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a loading state or skeleton while client-side hydration is happening
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AppProvider>{children}</AppProvider>;
=======
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';

import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended for Celo',
      wallets: [
        walletConnectWallet, // Valora works through this
        metaMaskWallet,
      ],
    },
    {
      groupName: 'Popular Wallets',
      wallets: [
        coinbaseWallet,
        trustWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'SapaSafe - Secure Savings Vault',
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '636fbbf256896d1aec459c53de2530f1',
  }
);

const config = createConfig({
  connectors,
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http(),
  },
});

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
>>>>>>> 5118ac7a46d3f208e64dc3261efd4077d2443aed
}