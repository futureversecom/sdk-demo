'use client';

import React, { useEffect } from 'react';

import TransactionDetails from './TransactionDetails';
import { useIsMounted } from '../hooks';

import {
  AssetFromFuturePassFeeProxy,
  AssetFromFuturePass,
} from '../components';

import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';

export default function Transfer() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { gas, resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with assets</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Asset Demo</h1>
      <div className="auto-grid">
        <AssetFromFuturePass />
        <AssetFromFuturePassFeeProxy />
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
