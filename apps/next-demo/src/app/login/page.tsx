'use client';

import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';
import { Spinner } from '@fv-sdk-demos/ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
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
      <div className="row login-row">
        <div className="card">
          <div className="inner">
            <div className="grid cols-1">
              <div
                className="spinner"
                style={{
                  margin: '0 auto',
                  marginTop: '16px',
                  width: '100px',
                  height: '100px',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                Redirecting, please wait...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (signInState === false) {
    return (
      <div className="row login-row">
        <div className="card">
          <div className="inner">
            <div className="grid cols-1">
              <div style={{ textAlign: 'center' }}>
                Not Authenticated - Please Try Again...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="row login-row">
      <div className="card">
        <div className="inner">
          <div className="grid cols-1">
            <div
              className="spinner"
              style={{
                margin: '0 auto',
                marginTop: '16px',
                width: '100px',
                height: '100px',
              }}
            />
            <div style={{ textAlign: 'center' }}>Authenticating...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
