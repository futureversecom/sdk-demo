'use client';

import { UserSession } from '@futureverse/auth';
import { useAuth } from '@futureverse/auth-react';
import { useEffect, useState } from 'react';

export default function Login() {
  const { authClient } = useAuth();
  const [signInState, setSignInState] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const userStateChange = (user: UserSession | undefined) => {
      if (user) {
        setSignInState(true);
      }
      if (!user) {
        setSignInState(false);
      }
    };

    authClient.addUserStateListener(userStateChange);
    return () => {
      authClient.removeUserStateListener(userStateChange);
    };
  }, [authClient]);

  if (signInState === true) {
    return <div>Authenticated</div>;
  }
  if (signInState === false) {
    return <div>Not Authenticated</div>;
  }
  return <div>Authenticating...</div>;
}
