'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import {
  EoaErc721Mint,
  Erc721Mint,
  FeeProxyErc721Mint,
  FpassErc721Mint,
} from './Erc721';

export default function EvmErc721() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with ERC-721 through EVM</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>ERC-721 Demo</h1>

      <div className="auto-grid">
        <EoaErc721Mint />
        <FpassErc721Mint />
        <FeeProxyErc721Mint />
        <Erc721Mint />
      </div>
    </>
  );
}
