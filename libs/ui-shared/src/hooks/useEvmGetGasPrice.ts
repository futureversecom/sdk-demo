'use client';

import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';

export function useEvmGetGasPrice({
  gasFeePerGas,
  gasEstimate,
}: {
  gasFeePerGas: string;
  gasEstimate: string;
}) {
  const publicClient = usePublicClient();

  const getGasPrice = async ({
    gasFeePerGas,
    gasEstimate,
  }: {
    gasFeePerGas: bigint;
    gasEstimate: bigint;
  }) => {
    if (!gasFeePerGas || !gasEstimate) {
      console.log('Error getting gas estimate');
      return;
    }

    const gasPrice = await publicClient?.getGasPrice();

    if (!gasPrice) {
      console.log('Error getting gas price');
      return;
    }

    const gasCostInEth = gasEstimate * gasPrice;
    const remainder = gasCostInEth % 10n ** 12n;
    const gasCostInXrp = gasCostInEth / 10n ** 12n + (remainder > 0 ? 1n : 0n);

    return formatUnits(gasCostInXrp, 6);
  };

  return useQuery({
    queryKey: ['gasPrice', gasFeePerGas, gasEstimate],
    queryFn: async () =>
      getGasPrice({
        gasFeePerGas: BigInt(gasFeePerGas),
        gasEstimate: BigInt(gasEstimate),
      }),
    enabled:
      !!gasFeePerGas &&
      !!gasEstimate &&
      gasFeePerGas !== '0' &&
      gasEstimate !== '0',
  });
}
