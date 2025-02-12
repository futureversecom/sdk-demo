'use client';
import { useMemo } from 'react';
import { RootQueryBuilder } from '@futureverse/transact';
import { useAuth } from '@futureverse/auth-react';
import { useTrnApi } from '@futureverse/transact-react';

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
