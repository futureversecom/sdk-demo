'use client';
import { useAuth } from '@futureverse/auth-react';
import { ERC20_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { parseAbi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export function useEvmGetBalance(contract: string, type: string) {
  const { userSession } = useAuth();
  const chainId = useChainId();

  return useReadContract({
    abi: parseAbi(ERC20_PRECOMPILE_ABI),
    address: contract as `0x${string}`,
    functionName: 'balanceOf',
    args: [type === 'eoa' ? userSession?.eoa : userSession?.futurepass],
    query: {
      enabled: !!userSession && chainId === userSession.chainId && !!contract,
    },
  });
}
