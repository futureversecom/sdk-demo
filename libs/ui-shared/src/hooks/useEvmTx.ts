'use client';
import { useCallback } from 'react';
import { useAccount, useConfig, useWriteContract } from 'wagmi';
//import { useEvmFuturePassProxy } from './useEvmFuturePassProxy';
import { useEvmFeeProxy } from './useEvmFeeProxy';
import {
  Abi,
  Account,
  Address,
  ContractFunctionArgs,
  encodeFunctionData,
  parseAbi,
} from 'viem';
import { useAuth } from '@futureverse/auth-react';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';

export function useEvmTx() {
  const { userSession } = useAuth();
  const { chain } = useAccount();
  const config = useConfig();

  const {
    data: evmHash,
    writeContract: evmWrite,
    isPending: evmPending,
    isSuccess: evmSuccess,
    isError: evmIsError,
    error: evmError,
  } = useWriteContract();

  const {
    data: futurePassHash,
    writeContract: futurePassProxyWrite,
    isPending: futurePassPending,
    isSuccess: futurePassSuccess,
    isError: futurePassIsError,
    error: futurePassError,
  } = useWriteContract();

  const {
    data: feeProxyHash,
    mutate: feeProxyWrite,
    isSuccess: feeProxySuccess,
    isPending: feeProxyPending,
    isError: feeProxyIsError,
    error: feeProxyError,
  } = useEvmFeeProxy();

  const hash = evmHash || futurePassHash || feeProxyHash;
  const isPending = evmPending || futurePassPending || feeProxyPending;
  const isSuccess = evmSuccess || futurePassSuccess || feeProxySuccess;
  const isError = evmIsError || futurePassIsError || feeProxyIsError;
  const error = evmError || futurePassError || feeProxyError;

  const chainId = (chain?.id ?? userSession?.chainId) as number;

  const submitTx = useCallback(
    async ({
      account,
      address,
      abi,
      functionName,
      args,
      fromWallet,
      gasToken,
      slippage,
    }: {
      account: Account | Address;
      address: Address;
      abi: Abi;
      functionName: string;
      args: ContractFunctionArgs;
      fromWallet: string;
      gasToken: number;
      slippage: string;
    }) => {
      if (!account) {
        throw new Error('Account is required');
      }
      if (!address) {
        throw new Error('Address is required');
      }

      if (fromWallet === 'fpass' && gasToken === 2) {
        const futurePassCall = encodeFunctionData({
          abi,
          functionName,
          args,
        });

        return futurePassProxyWrite({
          account,
          address: userSession?.futurepass as Address,
          chainId,
          abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
          functionName: 'proxyCall',
          args: [1, address, 0n, futurePassCall],
        });
      }

      if (fromWallet === 'eoa' && gasToken !== 2) {
        return feeProxyWrite({
          config,
          account,
          chainId,
          abi,
          address,
          functionName,
          args,
          gasToken,
          slippage,
        });
      }

      return await evmWrite({
        account,
        abi,
        address,
        functionName,
        args,
      });
    },
    [
      evmWrite,
      futurePassProxyWrite,
      config,
      userSession?.futurepass,
      chainId,
      feeProxyWrite,
    ]
  );

  return { submitTx, hash, isPending, isError, error, isSuccess };
}
