'use client';
import React, { useCallback, useState } from 'react';

import { authProvidersCodeString } from '../../lib/';
import CodeView from '../CodeView';
import { useAuth } from '@futureverse/auth-react';

const codeString = `
'use client';
import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Login() {
  const { authClient } = useAuth();
  const [signInState, setSignInState] = useState<boolean | undefined>(
    undefined
  );

  const router = useRouter();

  useEffect(() => {
    const userStateChange = (user: UserSession | undefined) => {
      if (user) {
        setSignInState(true);
        router.push('/');
      }
      if (!user) {
        setSignInState(false);
      }
    };

    authClient.addUserStateListener(userStateChange);
    return () => {
      authClient.removeUserStateListener(userStateChange);
    };
  }, [authClient, router]);

  if (signInState === true) {
    return (
      <RowComponent showSpinner={true}>
        Redirecting, please wait...
      </RowComponent>
    );
  }
  if (signInState === false) {
    return (
      <RowComponent showSpinner={false}>
        <div>Not Authenticated - Please Log In...</div>
        <LogIn
          styles={{
            padding: ' 16px',
            fontWeight: '700',
            fontSize: '1.2rem',
          }}
        />
      </RowComponent>
    );
  }
  return <RowComponent showSpinner={true}>Authenticating...</RowComponent>;
}

const RowComponent = ({
  children,
  showSpinner,
}: {
  children: React.ReactNode;
  showSpinner: boolean;
}) => {
  return (
    <div className="row login-row">
      <div className="card login-card">
        <div className="inner">
          <div className="grid cols-1 login-grid" style={{}}>
            {showSpinner && <div className="spinner" />}
            <div style={{ textAlign: 'center' }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};`;

export function AuthCallBack() {
  const [triggered, setTriggered] = useState(false);
  const { userSession, isFetchingSession } = useAuth();
  const [signInState, setSignInState] = useState<boolean | undefined>(
    undefined
  );

  const resetState = () => {
    setSignInState(undefined);
    setTriggered(false);
  };

  const loginSuccess = useCallback(() => {
    userSession &&
      setTimeout(() => {
        setSignInState(
          isFetchingSession ? undefined : userSession ? true : false
        );
        setTimeout(() => {
          resetState();
        }, 5000);
      }, 3000);
  }, [userSession, isFetchingSession]);

  const loginFail = useCallback(() => {
    setTimeout(() => {
      setSignInState(false);
      setTimeout(() => {
        resetState();
      }, 5000);
    }, 3000);
  }, []);

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online User Session</h3>
          </CodeView>
        </div>
        {!triggered ? (
          <div
            className="row"
            style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
          >
            <button
              className="green no-margin"
              onClick={() => {
                setTriggered(true);
                setSignInState(undefined);
                loginSuccess();
              }}
            >
              Simulate Login Callback
            </button>
            <button
              className="green no-margin"
              onClick={() => {
                setTriggered(true);
                setSignInState(undefined);
                loginFail();
              }}
            >
              Simulate Login Fail Callback
            </button>
          </div>
        ) : (
          <>
            {typeof signInState === 'undefined' && (
              <RowComponent showSpinner={true}>Authenticating...</RowComponent>
            )}
            {signInState === false && (
              <RowComponent showSpinner={false}>
                <div>Not Authenticated - Please Log In...</div>
              </RowComponent>
            )}
            {signInState === true && (
              <RowComponent showSpinner={true}>
                Authenticated, please wait (Redirecting)...
              </RowComponent>
            )}
            <button className="green no-margin" onClick={() => resetState()}>
              Reset Login State
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const RowComponent = ({
  children,
  showSpinner,
}: {
  children: React.ReactNode;
  showSpinner: boolean;
}) => {
  return (
    <div className="row">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {showSpinner && <div className="spinner" />}
        <div style={{ textAlign: 'left' }}>{children}</div>
      </div>
    </div>
  );
};
