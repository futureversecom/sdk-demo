import { createWagmiConfig } from '@futureverse/wagmi-connectors';
import { FutureverseAuthClient } from '@futureverse/auth-react/auth';
import { polygonAmoy, sepolia, mainnet } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';

const clientId = 'zqmb2I6JT3dlAVzF5VOc9';
const walletConnectProjectId = '8b9b9cf8501efbce91cd5a15157c01c4';
const xamanAPIKey = '5376fa18-f6d8-45d6-98df-cfdbc6b3b62b';

export const authClient = new FutureverseAuthClient({
  clientId,
  environment: 'staging',
  redirectUri: `${
    typeof window !== 'undefined' ? window.location.href : ''
  }login`,
  signInFlow: 'popup',
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
