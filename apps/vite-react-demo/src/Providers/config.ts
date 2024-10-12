import { createWagmiConfig } from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { polygonAmoy, sepolia, mainnet } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';

const clientId = import.meta.env.VITE_CLIENT_ID;
const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT;
const xamanAPIKey = import.meta.env.VITE_XAMAN_API;

console.log(
  'Redirect URL:',
  `${
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${
          window.location.hostname ?? window.location.host
        }${window.location.port === '' ? '' : `:${window.location.port}`}/`
      : ''
  }login`
);

export const authClient = new FutureverseAuthClient({
  clientId,
  environment: 'staging',
  redirectUri: `${
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${
          window.location.hostname ?? window.location.host
        }${window.location.port === '' ? '' : `:${window.location.port}`}/`
      : ''
  }login`,
  signInFlow: 'redirect',
});
export const queryClient = new QueryClient();

export const getWagmiConfig = async () => {
  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
    ssr: true,
    chains: [mainnet, sepolia, polygonAmoy],
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
};
