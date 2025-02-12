'use client';

import { useAuth } from '@futureverse/auth-react';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { useMemo } from 'react';
import { encodeFunctionData, parseAbi } from 'viem';
import { useEstimateGas } from 'wagmi';

export function useEvmFuturePassProxyGas({
  contract,
  data,
  enabled,
}: {
  contract: string;
  data: string;
  enabled: boolean;
}) {
  const { userSession } = useAuth();

  const fpassEvmData = useMemo(() => {
    return encodeFunctionData({
      abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
      functionName: 'proxyCall',
      args: [1, contract, 0n, data],
    });
  }, [contract, data]);

  return useEstimateGas({
    chainId: userSession?.chainId,
    account: userSession?.eoa as `0x${string}`,
    to: userSession?.futurepass as `0x${string}`,
    data: fpassEvmData,
    query: {
      enabled,
    },
  });
}
