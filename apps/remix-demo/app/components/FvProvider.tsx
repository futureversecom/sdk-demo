import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { authClient, getWagmiConfig, queryClient } from './config';

import { AuthUiProvider, DarkTheme, ThemeConfig } from '@futureverse/auth-ui';

import { State } from 'wagmi';
import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from '@futureverse/auth-react';

import type { NetworkName } from '@therootnetwork/api';
import { RootStoreProvider, TrnApiProvider } from '@fv-sdk-demos/ui-shared';

const customTheme: ThemeConfig = {
  ...DarkTheme,
  defaultAuthOption: 'web3',
};

const network = (process.env.NETWORK ?? 'porcini') as NetworkName | undefined;

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