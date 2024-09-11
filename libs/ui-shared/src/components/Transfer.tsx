import { useEffect } from 'react';

import TransactionDetails from './TransactionDetails';
import { useIsMounted } from '../hooks';

import {
  AssetFromEoa,
  AssetFromEoaFeeProxy,
  AssetFromFuturePassFeeProxy,
  AssetFromFuturePass,
} from '../components';

import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../hooks/useRootStore';
import { CustomFromEoaFuturePassFeeProxy } from './TransferComps';

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
    return <h1>Sign in to send funds</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Examples</h1>
      <div className="auto-grid">
        <AssetFromEoa />
        <AssetFromFuturePass />
        <AssetFromEoaFeeProxy />
        <AssetFromFuturePassFeeProxy />
        <CustomFromEoaFuturePassFeeProxy />
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
