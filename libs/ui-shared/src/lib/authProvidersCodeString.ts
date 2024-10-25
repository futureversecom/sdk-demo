export const authProvidersCodeString = `
/**
 *
 * layout.tsx
 *
 **/

import type { Metadata } from 'next';

import './globals.css';

import { Providers } from '@/Providers';
import { headers } from 'next/headers';
import { getWagmiConfig } from '@/Providers/config';
import { cookieToInitialState } from 'wagmi';

export const metadata: Metadata = {
  title: 'Futureverse SDKs: Next Demo',
  description: 'Futureverse SDKs: Next Demo',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getWagmiConfig();
  const initialState = cookieToInitialState(config, headers().get('cookie'));

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers initialWagmiState={initialState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}


/**
  *
  * Providers.tsx
  *
  **/
'use client';

import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { authClient, getWagmiConfig, queryClient } from './config';
import { RootStoreProvider, TrnApiProvider } from '@fv-sdk-demos/ui-shared';

import { AuthUiProvider, DarkTheme, ThemeConfig } from '@futureverse/auth-ui';

import { State } from 'wagmi';
import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from '@/components/client-components';
import type { NetworkName } from '@therootnetwork/api';

const customTheme: ThemeConfig = {
  ...DarkTheme,
  defaultAuthOption: 'web3',
};

const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'porcini') as
  | NetworkName
  | undefined;

export default function Providers({
  children,
  initialWagmiState,
}: {
  children: React.ReactNode;
  initialWagmiState?: State;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrnApiProvider network={network}>
        <FutureverseWagmiProvider
          getWagmiConfig={getWagmiConfig}
          initialState={initialWagmiState}
        >
          <RootStoreProvider>
            <FutureverseAuthProvider authClient={authClient}>
              <AuthUiProvider themeConfig={customTheme} authClient={authClient}>
                {children}
              </AuthUiProvider>
            </FutureverseAuthProvider>
          </RootStoreProvider>
        </FutureverseWagmiProvider>
      </TrnApiProvider>
    </QueryClientProvider>
  );
}

/**
 *
 * config.ts
 *
 */
import {
  createWagmiConfig,
  xamanWallet,
  futureverseCustodialWallet,
} from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { mainnet, rootPorcini } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';
import { http, Storage } from '@wagmi/core';
import { coinbaseWallet, metaMask, walletConnect } from '@wagmi/connectors';

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT as string;
const xamanAPIKey = process.env.NEXT_PUBLIC_XAMAN_API as string;

export const authClient = new FutureverseAuthClient({
  clientId,
  environment: 'staging',
  redirectUri: \`\${
    typeof window !== 'undefined' ? \`\${window.location.origin}/login\` : ''
  }\`,
  signInFlow: 'redirect',
});
export const queryClient = new QueryClient();

export const getWagmiConfig = async () => {
  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
    // connectors,
    metamaskDappMetadata: {
      name: 'Root Network Playground',
      url: 'https://playground.therootnetwork.com',
    },
    transports: {
      7672: http('https://porcini.rootnet.app/'),
    },
    ssr: true,
    chains: [mainnet, rootPorciniAlt],
    storage: createStorage({
      storage: cookieStorage,
    }) as Storage,
  });
};

`;
