import React from 'react';

import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from '@futureverse/auth-react';

import { QueryClientProvider } from '@tanstack/react-query';
import { authClient, getWagmiConfig, queryClient } from './config';

import { State } from 'wagmi';
import {
  type ThemeConfig,
  DarkTheme,
  AuthUiProvider,
} from '@futureverse/auth-ui';
import { RootStoreProvider, TrnApiProvider } from '@fv-sdk-demos/ui-shared';
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
      <FutureverseWagmiProvider
        getWagmiConfig={getWagmiConfig}
        initialState={initialWagmiState}
      >
        <TrnApiProvider network={network}>
          <RootStoreProvider>
            <FutureverseAuthProvider authClient={authClient}>
              <AuthUiProvider themeConfig={customTheme} authClient={authClient}>
                {children}
              </AuthUiProvider>
            </FutureverseAuthProvider>
          </RootStoreProvider>
        </TrnApiProvider>
      </FutureverseWagmiProvider>
    </QueryClientProvider>
  );
}
