'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import { FeeProxyErc1155Mint, FeeProxyErc1155MintSingle } from './Erc1155';
import { FeeProxyErc20Transfer } from './Erc20';
import { FeeProxyErc721Mint } from './Erc721';
export default function FeeProxy() {
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
      <h1>EVM Fee Proxy Demo</h1>

      <div className="auto-grid">
        <FeeProxyErc20Transfer />
        <FeeProxyErc721Mint />
        <FeeProxyErc1155MintSingle />
        <FeeProxyErc1155Mint />
      </div>
    </>
  );
}
