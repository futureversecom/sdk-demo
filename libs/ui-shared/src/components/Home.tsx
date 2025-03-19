'use client';
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useIsMounted, useShouldShowEoa } from '../hooks';
import { LogIn } from './Navigation';
import { AccountCard } from './AccountCard';
import { ConnectorInfo } from './ConnectorInfo';
import { TokenInfo } from './TokenInfo';

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
        <>
          <div className="row mb-4">
            <div
              className="auto-grid "
              style={{ marginBottom: '32px', width: '100%', columnSpan: 'all' }}
            >
              <div className="card">
                <div className="inner">
                  <p>
                    Here you will find code snippets for some of our SDKs. The
                    snippets are in the context of this SDK Playground, so you
                    can run them and see the results in real-time, using the
                    code in our{' '}
                    <a
                      href="https://github.com/futureversecom/sdk-demo/"
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      public GitHub repository
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="grid cols-3">
              <ConnectorInfo />
              <TokenInfo />
              {/* <SignerDebug /> */}
            </div>
            <div className="grid cols-3" style={{ marginTop: '16px' }}>
              {shouldShowEoa && <AccountCard type="eoa" title="EOA" />}
              <AccountCard type="futurepass" title="Pass.Online" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
