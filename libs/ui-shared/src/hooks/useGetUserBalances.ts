'use client';

import { getBalances } from '../lib/utils';
import { useTransactQuery } from './useTransactQuery';
import { useQuery } from '@tanstack/react-query';
type WalletBalances = Array<{
  walletAddress: string;
  balance: string;
  rawBalance: string;
  decimals: number;
}>;

export default function useGetUserBalance(
  walletAssetIds: Array<{
    walletAddress: string;
    assetId: number;
  }>
) {
  const transactionQuery = useTransactQuery();

  return useQuery<WalletBalances, Error>({
    queryKey: ['balances', walletAssetIds],
    queryFn: async () => getBalances(transactionQuery, walletAssetIds),
    enabled: !!walletAssetIds && !!transactionQuery,
  });
}
