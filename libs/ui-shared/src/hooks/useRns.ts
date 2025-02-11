'use client';

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
