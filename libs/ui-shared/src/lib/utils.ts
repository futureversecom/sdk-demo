import { RootQueryBuilder } from '@futureverse/transact';
import { formatUnits, getAddress } from 'viem';

export const collectionIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xcccccccc${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const shortAddress = (address: string, start = 6, end = 4) => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getBalance = async (
  transactionQuery: RootQueryBuilder | undefined,
  address: string,
  assetId: number
) => {
  if (!transactionQuery) {
    return '0';
  }

  const balance = await transactionQuery?.checkBalance({
    walletAddress: address,
    assetId: assetId,
  });

  return balance
    ? formatUnits(BigInt(balance?.balance), balance?.decimals)
    : '0';
};
