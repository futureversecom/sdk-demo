import { useMutation } from '@tanstack/react-query';
import type { Abi, Account, Address, ContractFunctionArgs } from 'viem';
import { encodeFunctionData, getAddress, parseAbi } from 'viem';
import {
  estimateFeesPerGas,
  estimateGas,
  readContract,
  simulateContract,
  writeContract,
} from '@wagmi/core';
import { ASSET_ID } from '../lib/utils';
import {
  assetIdToERC20Address,
  DEX_PRECOMPILE_ABI,
  DEX_PRECOMPILE_ADDRESS,
  FEE_PROXY_PRECOMPILE_ABI,
  FEE_PROXY_PRECOMPILE_ADDRESS,
} from '@therootnetwork/evm';
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

const ALLOWED_CHAINS = [7668, 7672];

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
  if (!chainId) throw new Error('Chain is required');
  if (!config) throw new Error('Client is required');
  if (!account) throw new Error('Account is required');
  if (!abi) throw new Error('ABI is required');
  if (!functionName) throw new Error('Function name is required');
  if (!address) throw new Error('Address is required');

  console.log('address from feeProxy', address);

  if (!ALLOWED_CHAINS.includes(chainId))
    throw new Error(
      'Invalid chain. Please use either Root Network or Porcini.'
    );

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  const gasEstimate = await estimateGas(config, { data, to: address });

  const feeData = await estimateFeesPerGas(config);

  const gasCostInEth =
    gasEstimate *
    BigInt(
      Math.floor(
        parseInt(feeData.maxFeePerGas.toString()) * (1 + Number(slippage) / 100)
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

  const { request } = await simulateContract(config, {
    account,
    chainId,
    gas: gasEstimate,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: 0n,
    address: getAddress(FEE_PROXY_PRECOMPILE_ADDRESS),
    abi: parseAbi(FEE_PROXY_PRECOMPILE_ABI),
    functionName: 'callWithFeePreferences',
    args: [
      assetIdToERC20Address(gasToken) as Address,
      maxPayment,
      address,
      data,
    ],
  });

  return writeContract(config, request);
};

export function useEvmFeeProxy() {
  return useMutation({ mutationFn: evmFeeProxy });
}
