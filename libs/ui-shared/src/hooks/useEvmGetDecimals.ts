'use client';
import { useAuth } from '@futureverse/auth-react';
import { ERC20_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { Address, parseAbi } from 'viem';
import { useReadContract } from 'wagmi';

export function useEvmGetDecimals(contract: Address) {
  const { userSession } = useAuth();
  return useReadContract({
    address: contract,
    chainId: userSession?.chainId,
    abi: parseAbi(ERC20_PRECOMPILE_ABI),
    functionName: 'decimals',
  });
}
