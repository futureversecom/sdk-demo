import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';
import { LogIn } from '@fv-sdk-demos/ui-shared';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { authClient } = useAuth();
  const [signInState, setSignInState] = useState<boolean | undefined>(
    undefined
  );

  const navigate = useNavigate();

  useEffect(() => {
    const userStateChange = (user: UserSession | undefined) => {
      if (user) {
        setSignInState(true);
        navigate('/');
      }
      if (!user) {
        setSignInState(false);
      }
    };

    authClient.addUserStateListener(userStateChange);
    return () => {
      authClient.removeUserStateListener(userStateChange);
    };
  }, [authClient, navigate]);

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
