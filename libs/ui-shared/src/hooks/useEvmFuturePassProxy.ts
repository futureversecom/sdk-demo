import { useMutation } from '@tanstack/react-query';
import { simulateFuturePassProxy } from '../lib/utils';
import {
  encodeFunctionData,
  type Abi,
  type Account,
  type Address,
  type ContractFunctionArgs,
} from 'viem';
import { writeContract } from '@wagmi/core';
import { useWriteContract, type Config } from 'wagmi';

type IEvmFuturePassProxy = {
  config: Config;
  account: Account | Address;
  futurePass: Address;
  abi: Abi;
  chainId: number;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
};

const evmFuturePassProxy = async ({
  config,
  account,
  futurePass,
  abi,
  chainId,
  functionName,
  address,
  args,
}: IEvmFuturePassProxy) => {
  const { request } = await simulateFuturePassProxy({
    config,
    account,
    futurePass,
    abi,
    chainId,
    functionName,
    address,
    args,
  });

  return writeContract(config, request);
};

export function useEvmFuturePassProxy() {
  // const {
  //   data,
  //   writeContract,
  //   isPending,
  //   isError,
  //   error,
  // } = useWriteContract();

  // return {
  //   data,
  //   writeContract,
  //   isPending,
  //   isError,
  //   error,
  // }

  return useMutation({ mutationFn: evmFuturePassProxy });
}
