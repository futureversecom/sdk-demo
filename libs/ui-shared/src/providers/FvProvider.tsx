import React, { PropsWithChildren } from 'react';
import { FutureverseAuthClient } from '@futureverse/auth';

import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
  useFutureverseSigner,
} from '@futureverse/auth-react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TrnApiProvider } from './TRNProvider';
import { RootStoreProvider } from '@fv-sdk-demos/store-shared';

// This is a demo application
const clientId = 'v3KyIBYRhIl0EZrUh_26a';
const walletConnectProjectId = '899758e0688999b87dd871bcc0a9b5e2';
const xamanAPIKey = '5376fa18-f6d8-45d6-98df-cfdbc6b3b62b';

const authClient = new FutureverseAuthClient({
  clientId,
  environment: 'staging',
  redirectUri: `${
    typeof window !== 'undefined' ? window.location.href : ''
  }login`,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FutureverseWagmiProvider
        xamanApiKey={xamanAPIKey}
        walletConnectProjectId={walletConnectProjectId}
        authClient={authClient}
      >
        <TrnApiProvider network="porcini">
          <RootStoreProvider>
            <InnerProvider>{children}</InnerProvider>
          </RootStoreProvider>
        </TrnApiProvider>
      </FutureverseWagmiProvider>
    </QueryClientProvider>
  );
}

function InnerProvider({ children }: PropsWithChildren) {
  const signer = useFutureverseSigner();
  return (
    <FutureverseAuthProvider authClient={authClient} signer={signer}>
      {children}
    </FutureverseAuthProvider>
  );
}
