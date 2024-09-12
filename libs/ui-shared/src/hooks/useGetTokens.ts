import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '../providers';

const collectionId = 709732;

export function useGetTokens(walletAddress: string) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['tokens', walletAddress],
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
    enabled: !!trnApi && !!walletAddress,
    refetchInterval: 30000,
  });
}
