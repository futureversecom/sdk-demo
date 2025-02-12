'use client';

import '@therootnetwork/api-types';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';

type TokenData = {
  nextCursor: number;
  tokenCount: number;
  ownedTokens: number[];
};

export function useGetTokenCount(
  walletAddress: string,
  collectionId: number,
  refetchInterval: number | false = false
) {
  const { trnApi } = useTrnApi();

  return useInfiniteQuery<TokenData, Error>({
    queryKey: ['tokens', walletAddress, collectionId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!trnApi || !walletAddress) {
        console.log('Missing trnApi or walletAddress');
        return { nextCursor: 0, tokenCount: 0, ownedTokens: [] };
      }

      const tokensResponse = await trnApi.rpc.nft.ownedTokens(
        collectionId,
        walletAddress,
        pageParam,
        1000
      );

      const {
        0: nextCursor,
        1: tokenCount,
        2: ownedTokens,
      } = tokensResponse.toJSON() as unknown as [number, number, number[]];

      return {
        nextCursor,
        tokenCount,
        ownedTokens,
      };
    },
    getNextPageParam: lastPage => {
      console.log(lastPage);
      if (lastPage.nextCursor === 0) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: () => undefined,
    enabled: !!trnApi && !!walletAddress && !!collectionId,
    initialPageParam: 0,
    refetchInterval,
  });
}
