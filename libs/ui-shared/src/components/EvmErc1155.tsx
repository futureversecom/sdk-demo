'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import {
  EoaErc1155Mint,
  EoaErc1155MintSingle,
  Erc1155Mint,
  FeeProxyErc1155Mint,
  FeeProxyErc1155MintSingle,
  FpassErc1155Mint,
  FpassErc1155MintSingle,
} from './Erc1155';

export default function EvmErc1155() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with ERC-1155 through EVM</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>ERC-1155 Demo</h1>

      <div className="auto-grid">
        <EoaErc1155MintSingle />
        <EoaErc1155Mint />
        <FpassErc1155MintSingle />
        <FpassErc1155Mint />
        <FeeProxyErc1155MintSingle />
        <FeeProxyErc1155Mint />
        <Erc1155Mint />
      </div>
    </>
  );
}
