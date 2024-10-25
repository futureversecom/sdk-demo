'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import { FpassErc1155Mint, FpassErc1155MintSingle } from './Erc1155';
import { FpassErc20Transfer } from './Erc20';
import { FpassErc721Mint } from './Erc721';
export default function FuturePassProxy() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with Fee Proxy through EVM</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>EVM Pass.Online Proxy Demo</h1>

      <div className="auto-grid">
        <FpassErc20Transfer />
        <FpassErc721Mint />
        <FpassErc1155MintSingle />
        <FpassErc1155Mint />
      </div>
    </>
  );
}
