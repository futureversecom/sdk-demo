'use client';

import React, { useEffect } from 'react';

import { useIsMounted } from '../hooks';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';

import { ViewAssets } from './ViewAssetComps';

export default function ViewAssetsComp() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { resetState } = useRootStore(state => state);

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
      <h1>Asset Register</h1>
      <div className="auto-grid">
        <ViewAssets />
      </div>
    </>
  );
}
