import { Spinner } from '@fv-sdk-demos/ui-shared';
import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';
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
