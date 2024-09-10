import { getAddress } from 'viem'

export const collectionIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xcccccccc${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};
