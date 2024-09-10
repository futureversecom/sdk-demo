'use client';

import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { authClient, getWagmiConfig, queryClient } from './config';
import { RootStoreProvider, TrnApiProvider } from '@fv-sdk-demos/ui-shared';

import { DarkTheme, Theme } from '@futureverse/auth-ui';

import { State } from 'wagmi';
import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
  FutureverseAuthUiProvider,
} from '@/components/client-components';

const customTheme: Theme = {
  ...DarkTheme,
  images: {
    // logo: '/images/logo.svg',
    backgroundImage: undefined,
  },
};

export default function Providers({
  children,
  initialWagmiState,
}: {
  children: React.ReactNode;
  initialWagmiState?: State;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrnApiProvider network="porcini">
        <FutureverseWagmiProvider
          getWagmiConfig={getWagmiConfig}
          initialState={initialWagmiState}
        >
          <RootStoreProvider>
            <FutureverseAuthProvider authClient={authClient}>
              <FutureverseAuthUiProvider
                theme={customTheme}
                authClient={authClient}
              >
                {children}
              </FutureverseAuthUiProvider>
            </FutureverseAuthProvider>
          </RootStoreProvider>
        </FutureverseWagmiProvider>
      </TrnApiProvider>
    </QueryClientProvider>
  );
}
