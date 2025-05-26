import { createWagmiConfig } from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { mainnet } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';
import { http, Storage } from '@wagmi/core';
import { porcini } from '@futureverse/auth';

const authority = process.env.NEXT_PUBLIC_AUTHORITY as string;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT as string;
const xamanAPIKey = process.env.NEXT_PUBLIC_XAMAN_API as string;

export const authClient = new FutureverseAuthClient({
  // clientId,
  clientId: 'IO84YuZD41wzPjnoz6Oq6',
  // clientId: 'ONsEcSaCvPiW_DCnLf5Sj',
  environment: 'staging',
  redirectUri: `${
    typeof window !== 'undefined' ? `${window.location.origin}/login` : ''
  }`,
  signInFlow: 'redirect',
  signerAuthority: 'https://signer.passonline.dev',
  authority,
});
export const queryClient = new QueryClient();

export const getWagmiConfig = async () => {
  return createWagmiConfig({
    walletConnectProjectId,
    xamanAPIKey,
    authClient,
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
