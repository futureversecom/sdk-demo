'use client';

import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { authClient, getWagmiConfig, queryClient } from './config';
import { RootStoreProvider } from '@fv-sdk-demos/ui-shared';
import { TrnApiProvider } from '@futureverse/transact-react';
import { AuthUiProvider, DarkTheme, ThemeConfig } from '@futureverse/auth-ui';

import { State } from 'wagmi';
import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from '@/components/client-components';
import type { NetworkName } from '@therootnetwork/api';
import { AssetRegisterProvider } from './AssetRegisterProvider';

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
                <AssetRegisterProvider>{children}</AssetRegisterProvider>
              </AuthUiProvider>
            </FutureverseAuthProvider>
          </RootStoreProvider>
        </FutureverseWagmiProvider>
      </TrnApiProvider>
    </QueryClientProvider>
  );
}
