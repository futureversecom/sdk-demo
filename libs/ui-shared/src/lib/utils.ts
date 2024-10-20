import { RootQueryBuilder } from '@futureverse/transact';
import {
  FUTUREPASS_REGISTRAR_PRECOMPILE_ABI,
  FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS,
} from '@therootnetwork/evm';
import { Account, Address, formatUnits, getAddress, parseAbi } from 'viem';
// import { readContract } from 'viem/actions';
import { readContract } from '@wagmi/core';
import { Config } from 'wagmi';

export const ASSET_ID: Record<string, number> = {
  ROOT: 1,
  XRP: 2,
  SYLO: 3172,
  ASTO: 17508,
} as const;

export const ASSET_NAME: Record<number, string> = {
  1: 'ROOT',
  2: 'XRP',
  3172: 'SYLO',
  17508: 'ASTO',
} as const;

export const assetIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xcccccccc${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const nftCollectionIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xaaaaaaaa${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const sftCollectionIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xaaaaaaaa${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const erc20AddressToAssetId = (address: `0x${string}`) => {
  const collectionIdHex = address.slice(10, 18);
  const collectionId = parseInt(collectionIdHex, 16);
  return collectionId;
};
export const erc721AddressToCollectionId = (address: `0x${string}`) => {
  return erc20AddressToAssetId(address);
};
export const erc1155AddressToCollectionId = (address: `0x${string}`) => {
  return erc20AddressToAssetId(address);
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

export const getFuturePass = async (
  config: Config,
  address: Account | Address
): Promise<Address> => {
  return (await readContract(config, {
    address: getAddress(FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS),
    abi: parseAbi(FUTUREPASS_REGISTRAR_PRECOMPILE_ABI),
    functionName: 'futurepassOf',
    args: [address],
  })) as Address;
};
