'use client';
import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';

export function useGetNftPublicMint(collectionId: number) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['public-mint', collectionId],
    queryFn: async () => {
      if (!trnApi || !collectionId) {
        console.log('Missing trnApi or collectionId');
        return;
      }

      const publicMintInfo = await trnApi.query.nft.publicMintInfo(
        collectionId
      );

      const info = publicMintInfo?.unwrap();

      return {
        enabled: info.enabled.toHuman(),
        pricingDetails: info.pricingDetails.toJSON(),
      };
    },
    enabled: !!trnApi && !!collectionId,
  });
}
