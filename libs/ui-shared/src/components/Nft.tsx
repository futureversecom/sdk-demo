'use client';

import React, { useEffect } from 'react';

import TransactionDetails from './TransactionDetails';
import { useIsMounted } from '../hooks';

import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import {
  NftBurn,
  NftCreateCollection,
  NftMint,
  NftPublicMint,
  NftPublicMintPrice,
  NftTransfer,
} from './NftComps';

export default function Nft() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { gas, resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with custom extrinsics</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>NFT Demos</h1>
      <div className="auto-grid">
        <NftCreateCollection />
        <NftPublicMint />
        <NftPublicMintPrice />
        <NftMint />
        <NftTransfer />
        <NftBurn />
      </div>
      <div className="auto-grid">
        {gas && (
          <div className="w-full">
            <TransactionDetails />
          </div>
        )}
      </div>
    </>
  );
}
