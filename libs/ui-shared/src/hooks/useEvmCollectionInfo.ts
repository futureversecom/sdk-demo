'use client';
import { useAuth } from '@futureverse/auth-react';
import { ERC721_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { parseAbi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export function useEvmCollectionInfo(contract: string) {
  const { userSession } = useAuth();
  const chainId = useChainId();

  return useReadContract({
    abi: parseAbi(ERC721_PRECOMPILE_ABI),
    address: contract as `0x${string}`,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!userSession && chainId === userSession.chainId && !!contract,
    },
  });
}
