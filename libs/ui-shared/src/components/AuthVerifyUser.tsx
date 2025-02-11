'use client';

import React from 'react';
import { useIsMounted } from '../hooks';
import { VerifyIdToken, VerifyUser } from './Auth';
import { VerifyUserFrontEnd } from './Auth';

export default function AuthVerifyUser() {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Auth Verify User</h1>
      <div className="auto-grid gap-4">
        <VerifyUser />
        <VerifyUserFrontEnd />
        <VerifyIdToken />
      </div>
    </>
  );
}
