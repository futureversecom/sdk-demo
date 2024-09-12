import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import {
  AssetBuilder,
  BatchBuilder,
  BuilderType,
  CrowdsaleBuilder,
  CustomExtrinsicBuilder,
  EvmBuilder,
  NftBuilder,
  RemarkBuilder,
  SftBuilder,
  TransactionBuilder,
} from '@futureverse/transact';
import { useTrnApi } from '../providers/TRNProvider';
import { useMemo } from 'react';

export const useTransact = ({
  type,
  collectionId,
  assetId,
  saleId,
}: {
  type: BuilderType;
  collectionId?: number;
  assetId?: number;
  saleId?: number;
}):
  | NftBuilder
  | SftBuilder
  | AssetBuilder
  | EvmBuilder
  | CrowdsaleBuilder
  | CustomExtrinsicBuilder
  | BatchBuilder
  | RemarkBuilder
  | undefined => {
  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();
  const { userSession } = useAuth();
  const walletAddress = userSession?.eoa;

  const transactBuilder = useMemo(() => {
    if (!trnApi || !signer || !walletAddress) {
      return;
    }

    switch (type) {
      case 'nft':
        return TransactionBuilder.nft(
          trnApi,
          signer,
          walletAddress,
          collectionId
        ) as NftBuilder;
      case 'sft':
        return TransactionBuilder.sft(
          trnApi,
          signer,
          walletAddress,
          collectionId
        );
      case 'asset':
        if (!assetId) {
          throw new Error('Asset ID is required for AssetBuilder');
        }
        return TransactionBuilder.asset(trnApi, signer, walletAddress, assetId);
      case 'crowdsale':
        if (!saleId) {
          throw new Error('Sale ID is required for CrowdsaleBuilder');
        }
        return TransactionBuilder.crowdsale(
          trnApi,
          signer,
          walletAddress,
          saleId
        );
      case 'custom':
        return TransactionBuilder.custom(trnApi, signer, walletAddress);
      case 'evm':
        return TransactionBuilder.evm(trnApi, signer, walletAddress);
      case 'batch':
        return TransactionBuilder.batch(trnApi, signer, walletAddress);
      case 'remark':
        return TransactionBuilder.remark(trnApi, signer, walletAddress);
      default:
        return;
    }
  }, [trnApi, signer, walletAddress, type, collectionId, assetId, saleId]);

  return transactBuilder;
};
