import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '../providers';

export function useGetSftTokens(collectionId: number, walletAddress?: string) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['sft-tokens', collectionId, walletAddress],
    queryFn: async () => {
      if (!trnApi) {
        console.log('Missing trnApi or walletAddress');
        return;
      }

      const sftCollectionInfo = await trnApi.query.sft.sftCollectionInfo(
        collectionId
      );
      const info = sftCollectionInfo.unwrap();

      const collectionTokens = info.nextSerialNumber.toNumber() - 1;

      const tokenInfo = collectionTokens
        ? await Promise.all(
            Array.from([...new Array(collectionTokens)]).map(
              async (_, index) => {
                const token = await trnApi.query.sft.tokenInfo([
                  collectionId,
                  index,
                ]);
                const info = token.toHuman() as unknown as {
                  tokenName: string;
                  ownedTokens: [
                    string,
                    { freeBalance: string; reservedBalance: string }
                  ][];
                };

                const ownedTokens = walletAddress
                  ? info?.ownedTokens.find(owned => {
                      return (
                        owned[0].toLowerCase() === walletAddress.toLowerCase()
                      );
                    })
                  : null;

                return {
                  id: index,
                  tokenName: info?.tokenName,
                  reservedBalance: ownedTokens
                    ? ownedTokens?.[1].reservedBalance
                    : null,
                  freeBalance: ownedTokens
                    ? ownedTokens?.[1].freeBalance
                    : null,
                };
              }
            )
          )
        : [];

      return tokenInfo ?? null;
    },
    enabled: !!trnApi && !!collectionId,
    // refetchInterval: 30000,
  });
}
