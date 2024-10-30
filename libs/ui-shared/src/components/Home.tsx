'use client';
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useIsMounted, useShouldShowEoa } from '../hooks';
import { LogIn } from './Navigation';
import { AccountCard } from './AccountCard';
import { ConnectorInfo } from './ConnectorInfo';

export default function Home({ title }: { title: string }) {
  const isMounted = useIsMounted();
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userSession && (
        <div className="row">
          <h1>{title}</h1>
        </div>
      )}

      {!userSession && (
        <div className="row login-row">
          <div className="login-grid">
            <div className="card">
              <div className="inner">
                <h3>
                  Connect with your Pass to interact with the SDK Playground
                </h3>
                <LogIn
                  styles={{
                    padding: ' 16px',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {userSession && (
        <div className="row">
          <div className="auto-grid">
            <ConnectorInfo />
            {/* <SignerDebug /> */}
          </div>
          <div className="auto-grid " style={{ marginTop: '16px' }}>
            {shouldShowEoa && <AccountCard type="eoa" title="EOA" />}
            <AccountCard type="futurepass" title="Pass.Online" />
          </div>
        </div>
      )}
    </>
  );
}
