'use client';
import '@therootnetwork/api-types';

import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';

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

      // returns [0] => nextCursor, [1] => totalCount, [2] => ownedTokens
      const ownedTokens = tokens.toJSON()[2] as number[];

      return ownedTokens ?? [];
    },
    enabled: !!trnApi && !!walletAddress && !!collectionId,
    // refetchInterval: 30000,
  });
}
