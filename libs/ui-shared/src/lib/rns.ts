import { networks } from 'rootnameservice';
import { Address, Chain, createPublicClient, defineChain, http } from 'viem';
import { addresses } from 'rootnameservice';
import { normalize } from 'viem/ens';
import { namehash } from 'viem';

export const getRnsUrl = (hash: string, chain: Chain) => {
  const network = networks[chain.id === 7672 ? 'root' : 'porcini'].name;
  const nameWrapper =
    chain.id === 7672
      ? '0x44640d662a423d738d5ebf8b51e57afc0f2cf4df'
      : '0xBDC394b7704d3E0DC963a6Cb0Db92cBA2054da23';
  return `https://rns-metadata.fly.dev/${network}/${nameWrapper}/${hash}`;
};

export const getRnsFromAddress = async (
  address: string,
  chain: Chain
): Promise<string | null> => {
  const chainToUse = defineChain({
    ...chain,
    contracts: {
      ...addresses[chain.id as 7672 | 7668],
    },
    subgraphs: {
      ens: {
        url: 'https://subgraph.rootnameservice.com/subgraphs/name/graphprotocol/ens/graphql',
      },
    },
    testnet: chain.id === 7668 ? true : false,
  });

  const publicClient = createPublicClient({
    chain: chainToUse,
    transport: http(),
  });

  return await publicClient.getEnsName({
    address: address as Address,
  });

  // return (
  //   await getName(client, {
  //     address: address as Address,
  //   })
  // ).name;
};

export const getAddressFromRns = async (
  rns: string,
  chain: Chain
): Promise<string | null> => {
  const chainToUse = defineChain({
    ...chain,
    contracts: {
      ...addresses[chain.id as 7672 | 7668],
    },
    subgraphs: {
      ens: {
        url: 'https://subgraph.rootnameservice.com/subgraphs/name/graphprotocol/ens/graphql',
      },
    },
    testnet: chain.id === 7668 ? true : false,
  });

  const publicClient = createPublicClient({
    chain: chainToUse,
    transport: http(),
  });

  return await publicClient.getEnsAddress({
    name: normalize(rns),
  });
};

export const getRnsImage = async (
  rns: string,
  chain: Chain
): Promise<string | null> => {
  const url = getRnsUrl(namehash(rns), chain);
  return (await fetch(url + '/image')).text();
};

// export const getRnsMetadata = async (tokenId: bigint): Promise<Metadata> => {
//   const contract: ERC1155 = new ethers.Contract(
//     nameWrapper,
//     ERC1155_ABI,
//     provider
//   ) as ERC1155;

//   const uri: string = await contract.uri(tokenId);

//   const response = await fetch(uri);
//   return (await response.json()) as Metadata;
// };
