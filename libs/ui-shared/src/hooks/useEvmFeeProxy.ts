'use client';

import { useMutation } from '@tanstack/react-query';
import type { Abi, Account, Address, ContractFunctionArgs } from 'viem';
import { writeContract } from '@wagmi/core';
import { simulateFeeProxy } from '../lib/utils';
import type { Config } from 'wagmi';

type IEvmFeeProxy = {
  config: Config;
  chainId: number;
  account: Account | Address;
  abi: Abi;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
  gasToken: number;
  slippage: string;
};

const evmFeeProxy = async ({
  config,
  account,
  chainId,
  abi,
  functionName,
  address,
  args,
  gasToken,
  slippage,
}: IEvmFeeProxy) => {
  const { request } = await simulateFeeProxy({
    config,
    // account: account,
    account,
    chainId: chainId as number,
    abi,
    functionName,
    address,
    args,
    gasToken,
    slippage,
  });

  return writeContract(config, request);
};

export function useEvmFeeProxy() {
  return useMutation({ mutationFn: evmFeeProxy });
}
