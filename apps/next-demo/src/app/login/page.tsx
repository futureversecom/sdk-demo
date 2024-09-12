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
    return <div>Authenticated</div>;
  }
  if (signInState === false) {
    return <div>Not Authenticated</div>;
  }
  return (
    <div>
      <Spinner /> Authenticating...
    </div>
  );
}
