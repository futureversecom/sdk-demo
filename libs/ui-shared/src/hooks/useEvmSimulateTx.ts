'use client';

import {
  Abi,
  Address,
  ContractConstructorArgs,
  encodeFunctionData,
  parseAbi,
} from 'viem';
import { useAccount, useConfig, useSimulateContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { simulateFeeProxy } from '../lib/utils';
import { useEffect, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';

export function useEvmSimulateTx({
  fromWallet,
  account,
  address,
  abi,
  functionName,
  args,
  feeAssetId = 2,
  slippage,
}: {
  fromWallet: 'eoa' | 'fpass';
  account: Address;
  address: Address;
  abi: Abi;
  functionName: string;
  args: ContractConstructorArgs;
  feeAssetId: number;
  slippage: string;
}) {
  const { userSession } = useAuth();
  const { chainId } = useAccount();
  const config = useConfig();

  const {
    data: eoaData,
    isError: isEoaSimulateError,
    error: simulateEoaError,
    isPending: simulateEoaPending,
    isLoading: eoaIsLoading,
    refetch: fetchEoa,
  } = useSimulateContract({
    abi,
    account,
    address,
    functionName,
    args,
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      enabled: false,
      initialData: undefined,
    },
  });

  const {
    data: fpassData,
    isError: isFpassSimulateError,
    error: simulateFpassError,
    isPending: simulateFpassPending,
    isLoading: fpassIsLoading,
    refetch: fetchFpass,
  } = useSimulateContract({
    abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
    account: userSession?.eoa as Address,
    address: userSession?.futurepass as Address,
    functionName: 'proxyCall',
    args: [1, address, 0n, encodeFunctionData({ abi, functionName, args })],
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      enabled: false,
      initialData: undefined,
    },
  });

  const {
    data: feeProxyData,
    isError: isFeeProxySimulateError,
    error: simulateFeeProxyError,
    isPending: simulateFeeProxyPending,
    isLoading: feeProxyIsLoading,
    refetch: fetchFeeProxy,
  } = useQuery({
    queryKey: ['simulateFuturePassProxy', { address, abi, functionName }],
    queryFn: async () => {
      return await simulateFeeProxy({
        config,
        account,
        chainId: chainId as number,
        abi,
        functionName,
        address,
        args,
        gasToken: feeAssetId,
        slippage,
      });
    },
    enabled: false,
    initialData: undefined,
  });

  const [eoaIsLoaded, setEoaIsLoaded] = useState(false);
  const [feeProxyIsLoaded, setFeeProxyIsLoaded] = useState(false);
  const [fpassIsLoaded, setFpassIsLoaded] = useState(false);

  useEffect(() => {
    if (eoaIsLoading && !eoaIsLoaded) {
      setEoaIsLoaded(true);
    }
    if (fpassIsLoading && !fpassIsLoaded) {
      setFpassIsLoaded(true);
    }
    if (feeProxyIsLoading && !feeProxyIsLoaded) {
      setFeeProxyIsLoaded(true);
    }
  }, [
    eoaIsLoaded,
    fpassIsLoaded,
    feeProxyIsLoaded,
    eoaIsLoading,
    fpassIsLoading,
    feeProxyIsLoading,
  ]);

  useEffect(() => {
    if (fromWallet === 'eoa' && feeAssetId === 2 && !eoaIsLoaded) {
      fetchEoa();
    }
    if (fromWallet === 'fpass' && !fpassIsLoaded) {
      fetchFpass();
    }
    if (fromWallet === 'eoa' && feeAssetId !== 2 && !feeProxyIsLoaded) {
      fetchFeeProxy();
    }
  }, [
    fromWallet,
    feeAssetId,
    fetchEoa,
    fetchFpass,
    fetchFeeProxy,
    eoaIsLoaded,
    fpassIsLoaded,
    feeProxyIsLoaded,
  ]);

  const request =
    fromWallet === 'eoa' && feeAssetId === 2
      ? eoaData?.request
      : fromWallet === 'eoa' && feeAssetId !== 2
      ? feeProxyData?.request
      : fpassData?.request;

  const isError =
    isEoaSimulateError || isFpassSimulateError || isFeeProxySimulateError;
  const error = simulateEoaError || simulateFpassError || simulateFeeProxyError;
  const isPending =
    (simulateEoaPending && eoaIsLoaded) ||
    (simulateFpassPending && fpassIsLoaded) ||
    (simulateFeeProxyPending && feeProxyIsLoaded);

  console.log('request', request);
  console.log('eoaData', eoaData);
  console.log('feeProxyData', feeProxyData);
  console.log('fpassData', fpassData);

  return {
    request,
    isError,
    error: error && (error as unknown as { shortMessage: string }).shortMessage,
    isPending,
  };
}
