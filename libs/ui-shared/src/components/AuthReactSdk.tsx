'use client';

import React from 'react';
import { useIsMounted } from '../hooks';
import { AuthCallBack, AuthLogout, AuthUserSession, AuthSigner } from './Auth';

export default function AuthReactSdk() {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Auth React SDK Demo</h1>
      <div className="auto-grid">
        <div className="flex flex-col gap-16">
          <AuthCallBack />
          <AuthLogout />
          <AuthSigner />
        </div>
        <AuthUserSession />
      </div>
    </>
  );
}
