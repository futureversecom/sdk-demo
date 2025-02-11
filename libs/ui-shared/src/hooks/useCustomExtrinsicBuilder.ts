'use client';

import { TransactionBuilder } from '@futureverse/transact';
import type { Signer } from '@futureverse/signer';
import { ApiPromise } from '@polkadot/api';
import { useMemo } from 'react';

export const useCustomExtrinsicBuilder = ({
  trnApi,
  walletAddress,
  signer,
}: {
  trnApi: ApiPromise | null;
  walletAddress: string;
  signer: Signer | undefined | null;
}) => {
  const custom = useMemo(() => {
    if (!trnApi || !signer || !walletAddress) {
      return null;
    }
    return TransactionBuilder.custom(trnApi, signer, walletAddress);
  }, [signer, trnApi, walletAddress]);

  return custom;
};
