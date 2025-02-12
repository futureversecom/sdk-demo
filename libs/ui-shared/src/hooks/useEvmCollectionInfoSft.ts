'use client';

import { useAuth } from '@futureverse/auth-react';
import { ERC1155_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { parseAbi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export function useEvmCollectionInfoSft(contract: string) {
  const { userSession } = useAuth();
  const chainId = useChainId();

  return useReadContract({
    abi: parseAbi(ERC1155_PRECOMPILE_ABI),
    address: contract as `0x${string}`,
    functionName: 'owner',
    args: [],
    query: {
      enabled: !!userSession && chainId === userSession.chainId && !!contract,
    },
  });
}
