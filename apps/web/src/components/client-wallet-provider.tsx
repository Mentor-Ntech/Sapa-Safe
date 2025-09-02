'use client';

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
}