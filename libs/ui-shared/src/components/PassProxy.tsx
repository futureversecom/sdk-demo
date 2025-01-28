'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import { PassErc1155Mint, PassErc1155MintSingle } from './Erc1155';
import { PassErc20Transfer } from './Erc20';
import { PassErc721Mint } from './Erc721';
export default function PassProxy() {
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
        <PassErc20Transfer />
        <PassErc721Mint />
        <PassErc1155MintSingle />
        <PassErc1155Mint />
      </div>
    </>
  );
}
