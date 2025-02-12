'use client';

import { RootTransactionBuilder } from '@futureverse/transact';
import { useRootStore } from './useRootStore';

export function useGetExtrinsic() {
  const { setGas, setPayload, setToSign } = useRootStore(state => state);

  const getExtrinsic = async (builder: RootTransactionBuilder) => {
    const gasEstimate = await builder?.getGasFees();
    if (gasEstimate) {
      setGas(gasEstimate);
    }
    const payloads = await builder?.getPayloads();
    if (!payloads) {
      return;
    }
    setPayload(payloads);
    const { ethPayload } = payloads;
    setToSign(ethPayload.toString());
  };

  return getExtrinsic;
}
