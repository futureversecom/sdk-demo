import {
  createWagmiConfig,
  xamanWallet,
  futureverseCustodialWallet,
} from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { mainnet, rootPorcini } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';
import { Storage } from '@wagmi/core';
import { coinbaseWallet, metaMask, walletConnect } from '@wagmi/connectors';

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
  const custodialAuthOptions = await authClient.queryCustodialOptions();

  const connectors = [
    metaMask({
      dappMetadata: {
        name: 'FuturePass',
        url: 'https://playground.therootnetwork.com',
      },
    }),
    coinbaseWallet({
      appName: 'FuturePass',
      enableMobileWalletLink: true,
    }),
    xamanWallet({
      apiKey: xamanAPIKey,
      authClient,
    }),
    walletConnect({ projectId: walletConnectProjectId }),
    ...custodialAuthOptions.map(custodialOpt =>
      futureverseCustodialWallet({
        authClient,
        custodialOpt,
      })
    ),
  ];

  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
    connectors,
    ssr: true,
    chains: [mainnet, rootPorciniAlt],
    storage: createStorage({
      storage: cookieStorage,
    }) as Storage,
  });
};
