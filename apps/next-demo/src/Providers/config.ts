import { createWagmiConfig } from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { mainnet, rootPorcini } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT as string;
const xamanAPIKey = process.env.NEXT_PUBLIC_XAMAN_API as string;

export const authClient = new FutureverseAuthClient({
  clientId,
  environment: 'staging',
  redirectUri: `${
    typeof window !== 'undefined' ? `${window.location.origin}/login` : ''
  }`,
  signInFlow: 'redirect',
});
export const queryClient = new QueryClient();

const rootPorciniAlt = {
  ...rootPorcini,
  rpcUrls: {
    default: {
      http: [rootPorcini.rpcUrls.default.http[0].replace('/archive', '')],
      webSocket: [
        rootPorcini.rpcUrls.default.webSocket[0].replace('/archive', ''),
      ],
    },
  },
};

export const getWagmiConfig = async () => {
  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
    ssr: true,
    chains: [mainnet, rootPorciniAlt],
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
};
