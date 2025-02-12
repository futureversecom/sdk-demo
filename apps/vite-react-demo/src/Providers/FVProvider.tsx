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
  DefaultTheme,
  AuthUiProvider,
} from '@futureverse/auth-ui';
import { RootStoreProvider } from '@fv-sdk-demos/ui-shared';
import type { NetworkName } from '@therootnetwork/api';
import { TrnApiProvider } from '@futureverse/transact-react';
import { AssetRegisterProvider } from './AssetRegisterProvider';

const customThemeConfig: ThemeConfig = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
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
              <AuthUiProvider
                themeConfig={customThemeConfig}
                authClient={authClient}
              >
                <AssetRegisterProvider>{children}</AssetRegisterProvider>
              </AuthUiProvider>
            </FutureverseAuthProvider>
          </RootStoreProvider>
        </FutureverseWagmiProvider>
      </TrnApiProvider>
    </QueryClientProvider>
  );
}
