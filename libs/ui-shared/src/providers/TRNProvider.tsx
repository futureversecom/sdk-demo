'use client';

import '@therootnetwork/api-types';
import React, { type ReactNode, useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiPromise } from '@polkadot/api';
import { NetworkName, getApiOptions, getProvider } from '@therootnetwork/api';
import { NETWORK_PROVIDER } from '../helpers';

export interface ApiProps {
  trnApi: ApiPromise | null;
}

const ApiContext = createContext<ApiProps | null>(null);

export function useTrnApi() {
  const data = useContext(ApiContext);
  if (data === null) {
    throw new Error('useTrnApi must be used inside a TrnApiProvider');
  }
  return data;
}

export function TrnApiProvider({
  children,
  network = 'porcini',
}: {
  children: ReactNode;
  network?: NetworkName;
}) {
  const { data } = useQuery({
    queryKey: [`createApi ${network}`],
    queryFn: async () => {
      return await ApiPromise.create({
        noInitWarn: true,
        ...getApiOptions(),
        ...getProvider(NETWORK_PROVIDER[network].ws),
      });
    },
    retry: false,
    structuralSharing: false,
  });
  const trnApi = data ?? null;

  return (
    <ApiContext.Provider
      value={{
        trnApi,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
