import { getAddress } from 'viem';

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
