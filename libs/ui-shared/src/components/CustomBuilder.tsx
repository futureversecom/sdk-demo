'use client';

import React, { useEffect } from 'react';

import TransactionDetails from './TransactionDetails';
import { useIsMounted } from '../hooks';

import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import { CustomBuilderComp } from './CustomComps';

export default function CustomBuilder() {
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
      <h1>Custom Extrinsic Builder Demo</h1>
      <div className="auto-grid">
        <CustomBuilderComp />
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
