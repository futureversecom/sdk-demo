import { EthereumSigner, Signer } from '@futureverse/signer';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useMemo } from 'react';
import type { Account, Chain, Client, RpcSchema, Transport } from 'viem';
import { type Config, useConnectorClient, Connector } from 'wagmi';

export type SignerClient = Client<
  Transport,
  Chain,
  Account,
  RpcSchema,
  { signer?: Signer }
>;
export function clientToSigner(client: SignerClient) {
  const { account, chain, transport, signer } = client;
  if (signer instanceof Signer) {
    return signer;
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  return new EthereumSigner(new JsonRpcSigner(provider, account.address));
}
/** Action to convert a Viem Client to a Futureverse Signer. */
export function useFutureverseSigner({
  chainId,
  connector,
}: { chainId?: number; connector?: Connector } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId, connector });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
