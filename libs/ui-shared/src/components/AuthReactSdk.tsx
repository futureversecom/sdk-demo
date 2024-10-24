'use client';

import { useIsMounted } from '../hooks';
import { AuthCallBack, AuthLogout, AuthUserSession } from './Auth';

export default function AuthReactSdk() {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Auth React SDK Demo</h1>
      <div className="auto-grid">
        <AuthCallBack />
        <AuthUserSession />
        <AuthLogout />
      </div>
    </>
  );
}
