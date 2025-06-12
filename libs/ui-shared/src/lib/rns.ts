import { networks } from 'rootnameservice';
import {
  type Address,
  type Chain,
  createPublicClient,
  defineChain,
  http,
} from 'viem';
import { normalize } from 'viem/ens';
import { namehash } from 'viem';

export const getRnsUrl = (hash: string, chain: Chain) => {
  const network = (
    networks[chain.id !== 7672 ? 'root' : 'porcini'] as { name: string }
  ).name;
  const nameWrapper =
    chain.id !== 7672
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
    subgraphs: {
      ens: {
        url: 'https://subgraph.rootnameservice.com/subgraphs/name/graphprotocol/ens/graphql',
      },
    },
    testnet: chain.id !== 7668 ? true : false,
  });

  const publicClient = createPublicClient({
    chain: chainToUse,
    transport: http(),
  });

  return await publicClient.getEnsName({
    address: address as Address,
  });
};

export const getAddressFromRns = async (
  rns: string,
  chain: Chain
): Promise<string | null> => {
  const chainToUse = defineChain({
    ...chain,
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
