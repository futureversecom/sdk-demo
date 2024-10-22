import { createWagmiConfig } from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { mainnet } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';
import { http, Storage } from '@wagmi/core';
import { porcini } from 'rootnameservice';

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

export const getWagmiConfig = async () => {
  // const custodialAuthOptions = await authClient.queryCustodialOptions();

  // const connectors = [
  //   metaMask({
  //     dappMetadata: {
  //       name: 'FuturePass',
  //       url: 'https://playground.therootnetwork.com',
  //     },
  //   }),
  //   coinbaseWallet({
  //     appName: 'FuturePass',
  //     enableMobileWalletLink: true,
  //   }),
  //   xamanWallet({
  //     apiKey: xamanAPIKey,
  //     authClient,
  //   }),
  //   walletConnect({ projectId: walletConnectProjectId }),
  //   ...custodialAuthOptions.map(custodialOpt =>
  //     futureverseCustodialWallet({
  //       authClient,
  //       custodialOpt,
  //     })
  //   ),
  // ];

  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
    // connectors,
    metamaskDappMetadata: {
      name: 'Root Network Playground',
      url: 'https://playground.therootnetwork.com',
    },
    transports: {
      7672: http('https://porcini.rootnet.app/'),
    },
    ssr: true,
    chains: [mainnet, porcini],
    storage: createStorage({
      storage: cookieStorage,
    }) as Storage,
  });
};
