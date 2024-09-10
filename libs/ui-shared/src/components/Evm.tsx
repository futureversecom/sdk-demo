import React from 'react';

import { useEffect } from 'react';

import TransactionDetails from './TransactionDetails';
import Result from './Result';
import { useIsMounted } from '../hooks';

import { Increment, Decrement } from '../components';

import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';

export default function Transfer() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { gas, result, resetState } = useRootStore(state => state);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with the EVM Pallet</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Examples</h1>
      <div className="auto-grid">
        <Increment />
        <Decrement />
      </div>
      <div className="auto-grid">
        {gas && (
          <div className="w-full">
            <TransactionDetails />
          </div>
        )}
        {result && (
          <div className="w-full">
            <Result />
          </div>
        )}
      </div>
    </>
  );
}