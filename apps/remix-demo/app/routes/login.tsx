import { Spinner } from '@fv-sdk-demos/ui-shared';
import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';
import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';

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
    return <div>Authenticated</div>;
  }
  if (signInState === false) {
    return <div>Not Authenticated - Please Try Again</div>;
  }
  return (
    <div>
      <Spinner /> Authenticating...
    </div>
  );
}
