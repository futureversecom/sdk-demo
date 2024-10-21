'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import {
  EoaErc20Transfer,
  Erc20Transfer,
  FeeProxyErc20Transfer,
  FpassErc20Transfer,
} from './Erc20';

export default function EvmErc20() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with ERC-20 through EVM</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>ERC-20 Demo</h1>

      <div className="auto-grid">
        <EoaErc20Transfer />
        <FpassErc20Transfer />
        <FeeProxyErc20Transfer />
        <Erc20Transfer />
      </div>
    </>
  );
}
