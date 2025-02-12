'use client';

import { useCallback } from 'react';
import { Address, getAddress, parseAbi } from 'viem';
import { estimateFeesPerGas, estimateGas, readContract } from '@wagmi/core';
import { useConfig } from 'wagmi';
import {
  assetIdToERC20Address,
  DEX_PRECOMPILE_ABI,
  DEX_PRECOMPILE_ADDRESS,
} from '@therootnetwork/evm';
import { ASSET_ID } from '../lib/utils';

export function useEvmFeeProxyGas({
  data,
  address,
  gasToken,
  slippage,
}: {
  data: `0x${string}`;
  address: Address;
  gasToken: number;
  slippage: string;
}) {
  const config = useConfig();

  const getGas = useCallback(async () => {
    if (!config) {
      throw new Error('Config is required');
    }
    if (gasToken === 2) {
      return null;
    }

    const gasEstimate = await estimateGas(config, {
      data,
      to: address,
      maxFeePerGas: 0n,
    });

    const feeData = await estimateFeesPerGas(config);

    const gasCostInEth =
      gasEstimate *
      BigInt(
        Math.floor(
          parseInt(feeData.maxFeePerGas.toString()) *
            (1 + Number(slippage) / 100)
        )
      );
    const remainder = gasCostInEth % 10n ** 12n;
    const gasCostInXrp = gasCostInEth / 10n ** 12n + (remainder > 0 ? 1n : 0n);

    const [maxPayment] = (await readContract(config, {
      address: getAddress(DEX_PRECOMPILE_ADDRESS),
      abi: parseAbi(DEX_PRECOMPILE_ABI),
      functionName: 'getAmountsIn',
      args: [
        gasCostInXrp,
        [
          assetIdToERC20Address(gasToken) as Address,
          assetIdToERC20Address(ASSET_ID.XRP) as Address,
        ],
      ],
    })) as [bigint];

    return { gasCostInXrp, token: gasToken, gasCostInToken: maxPayment };
  }, [address, config, data, gasToken, slippage]);

  return { getGas };
}
