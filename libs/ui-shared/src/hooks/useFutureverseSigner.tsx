import { clientToSigner } from '@futureverse/signer';
import { useMemo } from 'react';
import { type Config, Connector, useWalletClient } from 'wagmi';

/** Action to convert a Viem Client to a Futureverse Signer. */
export function useFutureverseSigner({
  chainId,
  connector,
}: { chainId?: number; connector?: Connector } = {}) {
  const { data: client } = useWalletClient<Config>({
    chainId,
    connector,
  });

  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
