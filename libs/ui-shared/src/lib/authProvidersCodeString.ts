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
import { TrnApiProvider } from '@futureverse/transact-react';

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
          <FutureverseAuthProvider authClient={authClient}>
            <AuthUiProvider themeConfig={customTheme} authClient={authClient}>
              {children}
            </AuthUiProvider>
          </FutureverseAuthProvider>
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
import { createWagmiConfig } from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { mainnet } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';
import { http, Storage } from '@wagmi/core';
import { porcini } from '@futureverse/auth';

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT as string;
const xamanAPIKey = process.env.NEXT_PUBLIC_XAMAN_API as string;

export const authClient = new FutureverseAuthClient({
  clientId,
  environment: 'staging',
  redirectUri: \`$\{
    typeof window !== 'undefined' ? \`$\{window.location.origin}/login\` : ''
  }\`,
  signInFlow: 'redirect',
});
export const queryClient = new QueryClient();

export const getWagmiConfig = async () => {
  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
    metamaskDappMetadata: {
      name: 'Root Network Playground',
      url: 'https://playground.therootnetwork.com',
    },
    transports: {
      7672: http('https://porcini.rootnet.app/'),
    },
    ssr: true,
    chains: [mainnet, porcini],
    storage: createStorage({
      storage: cookieStorage,
    }) as Storage,
  });
};

/**
 *
 * Callback Page - in our example, /login
 *
 */
'use client';

import { LogIn } from '@/components/client-components';
import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const { authClient } = useAuth();
  const [signInState, setSignInState] = useState<boolean | undefined>(
    undefined
  );

  const router = useRouter();

  useEffect(() => {
    const userStateChange = (user: UserSession | undefined) => {
      if (user) {
        setSignInState(true);
        router.push('/');
      }
      if (!user) {
        setSignInState(false);
      }
    };

    authClient.addUserStateListener(userStateChange);
    return () => {
      authClient.removeUserStateListener(userStateChange);
    };
  }, [authClient, router]);

  if (signInState === true) {
    return (
      <RowComponent>
        Redirecting, please wait...
      </RowComponent>
    );
  }
  if (signInState === false) {
    return (
      <RowComponent>
        <div>Not Authenticated - Please Log In...</div>
        <LogIn
          styles={{
            padding: ' 16px',
            fontWeight: '700',
            fontSize: '1.2rem',
          }}
        />
      </RowComponent>
    );
  }
  return <RowComponent showSpinner={true}>Authenticating...</RowComponent>;
}

const RowComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="row login-row">
      <div className="card login-card">
        <div className="inner">
          <div className="grid cols-1 login-grid" style={{}}>
            <div style={{ textAlign: 'center' }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


`;
