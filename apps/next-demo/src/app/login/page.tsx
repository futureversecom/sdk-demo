'use client';

import { LogIn } from '@/components/client-components';
import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';

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
      <div className="card">
        <div className="inner">
          <div
            className="grid cols-1"
            style={{ width: '90dvw', maxWidth: '400px' }}
          >
            {showSpinner && (
              <div
                className="spinner"
                style={{
                  margin: '0 auto',
                  marginTop: '16px',
                  width: '100px',
                  height: '100px',
                }}
              />
            )}
            <div style={{ textAlign: 'center' }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
