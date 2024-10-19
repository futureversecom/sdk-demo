import { useMutation } from '@tanstack/react-query';
// import { simulateContract, writeContract } from 'viem/actions';
import { getFuturePass } from '../lib/utils';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';
import type {
  Abi,
  Account,
  Address,
  // Chain,
  // Client,
  ContractFunctionArgs,
} from 'viem';
import { writeContract, simulateContract } from '@wagmi/core';
import { encodeFunctionData, parseAbi } from 'viem';
import type { Config } from 'wagmi';

type IEvmFuturePassProxy = {
  config: Config;
  account: Account | Address;
  abi: Abi;
  chainId: number;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
};

const ALLOWED_CHAINS = [7668, 7672];

const evmFuturePassProxy = async ({
  config,
  account,
  abi,
  chainId,
  functionName,
  address,
  args,
}: IEvmFuturePassProxy) => {
  if (!config) throw new Error('Client is required');
  if (!account) throw new Error('Account is required');
  if (!abi) throw new Error('ABI is required');
  if (!functionName) throw new Error('Function name is required');
  if (!address) throw new Error('Address is required');

  if (!ALLOWED_CHAINS.includes(chainId))
    throw new Error(
      'Invalid chain. Please use either Root Network or Porcini.'
    );

  console.log(config);

  const futurepass = await getFuturePass(config, account);

  const futurePassCall = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  const { request, result } = await simulateContract(config, {
    account,
    address: futurepass,
    abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
    chainId,
    functionName: 'proxyCall',
    args: [1, address, 0n, futurePassCall],
  });

  console.log('request', request);
  console.log('result', result);

  return writeContract(config, request);
};

export function useEvmFuturePassProxy() {
  return useMutation({ mutationFn: evmFuturePassProxy });
}
