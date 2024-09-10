import React from 'react';

import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from '@futureverse/auth-react';

import { QueryClientProvider } from '@tanstack/react-query';
import { authClient, getWagmiConfig, queryClient } from './config';

import { State } from 'wagmi';
import {
  Theme,
  DarkTheme,
  FutureverseAuthUiProvider,
} from '@futureverse/auth-ui';
import { RootStoreProvider, TrnApiProvider } from '@fv-sdk-demos/ui-shared';

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
      <FutureverseWagmiProvider
        getWagmiConfig={getWagmiConfig}
        initialState={initialWagmiState}
      >
        <TrnApiProvider network="porcini">
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
        </TrnApiProvider>
      </FutureverseWagmiProvider>
    </QueryClientProvider>
  );
}
