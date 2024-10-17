export const hooksCodeString = `
/**
  * useGetExtrinsic
  **/

import { RootTransactionBuilder } from '@futureverse/transact';
import { useRootStore } from './useRootStore';

export function useGetExtrinsic() {
  const { setGas, setPayload, setToSign } = useRootStore(state => state);

  const getExtrinsic = async (builder: RootTransactionBuilder) => {
    const gasEstimate = await builder?.getGasFees();
    if (gasEstimate) {
      setGas(gasEstimate);
    }
    const payloads = await builder?.getPayloads();
    if (!payloads) {
      return;
    }
    setPayload(payloads);
    const { ethPayload } = payloads;
    setToSign(ethPayload.toString());
  };

  return getExtrinsic;
}


/**
  * useTransactQuery
  **/

import { useMemo } from 'react';
import { RootQueryBuilder } from '@futureverse/transact';
import { useAuth } from '@futureverse/auth-react';
import { useTrnApi } from '../providers/TRNProvider';

export function useTransactQuery() {
  const { trnApi } = useTrnApi();
  const { userSession } = useAuth();
  const walletAddress = userSession?.eoa;

  const transactQuery = useMemo(() => {
    if (!trnApi || !walletAddress) {
      return;
    }
    return new RootQueryBuilder(trnApi, walletAddress);
  }, [trnApi, walletAddress]);

  return transactQuery;
}


/**
  * useShouldShowEoa
  **/

import { useAuth, useConnector } from '@futureverse/auth-react';
import { useMemo } from 'react';

export function useShouldShowEoa() {
  const { authMethod } = useAuth();
  const { connector } = useConnector();

  const shouldShowEoa = useMemo(() => {
    return connector?.id !== 'xaman' && authMethod === 'eoa';
  }, [connector, authMethod]);

  return shouldShowEoa;
}


/**
  * useRnsResolveRns
  **/

import type { FutureverseAuthClient } from '@futureverse/auth';
import { getAddressFromRns, getRnsFromAddress } from '../lib/rns';
import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';

export const useRnsResolveRns = (
  input: string,
  authClient: FutureverseAuthClient
) => {
  const currentChain: Chain = authClient.environment.chain;

  return useQuery({
    queryKey: ['rns', 'resolveRns', input],
    queryFn: async () => getAddressFromRns(input, currentChain),
    enabled:
      !!input &&
      input.endsWith('.root') &&
      (currentChain.id === 7672 || currentChain.id === 7668),
    refetchInterval: 0,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};


/**
  * useRnsResolveAddress
  **/

import type { FutureverseAuthClient } from '@futureverse/auth';
import { getAddressFromRns, getRnsFromAddress } from '../lib/rns';
import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';

export const useRnsResolveAddress = (
  input: string,
  authClient: FutureverseAuthClient
) => {
  const currentChain: Chain = authClient.environment.chain;

  return useQuery({
    queryKey: ['rns', 'resolveAddress', input],
    queryFn: async () => getRnsFromAddress(input, currentChain),
    enabled:
      !!input &&
      input.startsWith('0x') &&
      (currentChain.id === 7672 || currentChain.id === 7668),
    refetchInterval: 0,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};


/**
  * useGetTokens
  **/

import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '../providers';

export function useGetTokens(walletAddress: string, collectionId: number) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['tokens', walletAddress, collectionId],
    queryFn: async () => {
      if (!trnApi || !walletAddress) {
        console.log('Missing trnApi or walletAddress');
        return;
      }

      const tokens = await trnApi.rpc.nft.ownedTokens(
        collectionId,
        walletAddress,
        0,
        1000
      );

      const ownedTokens = tokens.toJSON()[2] as number[];

      return ownedTokens ?? [];
    },
    enabled: !!trnApi && !!walletAddress && !!collectionId,
    refetchInterval: 30000,
  });
}


/**
  * useGetCount
  **/

import { decodeFunctionResult, encodeFunctionData } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { useTrnApi } from '../providers';

export function useGetCount(TestContractAddress: any, TestContractAbi: any) {
  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();
  const { userSession } = useAuth();

  return useQuery({
    queryKey: ['contract', TestContractAddress],
    queryFn: async () => {
      if (!trnApi || !signer || !userSession) {
        console.log('Missing trnApi, signer or userSession');
        return;
      }

      const contractCall = encodeFunctionData({
        abi: TestContractAbi,
        functionName: 'getNumber',
        args: [],
      });

      const contractReturnData = await trnApi.rpc.eth.call({
        to: TestContractAddress,
        data: contractCall,
      });

      const returnData = decodeFunctionResult({
        abi: TestContractAbi,
        functionName: 'getNumber',
        data: contractReturnData.toHex(),
      });

      return (returnData as bigint).toString();
    },
    enabled: !!trnApi && !!signer && !!userSession,
    refetchInterval: 30000,
  });
}


`;
