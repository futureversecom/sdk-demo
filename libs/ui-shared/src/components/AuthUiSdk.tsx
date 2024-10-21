'use client';

import React, { useEffect, useState } from 'react';
import { useIsMounted } from '../hooks';

import {
  Auth,
  AuthCustodialFirst,
  AuthCustodialOnly,
  AuthHideSome,
  AuthWeb3Only,
} from './Auth';

import { AuthUiProvider, DarkTheme, ThemeConfig } from '@futureverse/auth-ui';
import { FutureverseAuthClient } from '@futureverse/auth';

const customTheme: ThemeConfig = {
  ...DarkTheme,
  defaultAuthOption: 'custodial',
};

export default function AuthUiSdk({
  authClient,
}: {
  authClient: FutureverseAuthClient;
}) {
  const isMounted = useIsMounted();
  const [theme, setTheme] = useState<ThemeConfig>(customTheme);

  useEffect(() => {
    document.body.classList.add('sdk-ui-demo');

    return () => {
      document && document.body.classList.remove('sdk-ui-demo');
    };
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <AuthUiProvider themeConfig={theme} authClient={authClient}>
      <h1>Auth UI SDK Demo</h1>
      <div className="auto-grid">
        <Auth setTheme={setTheme} />
        <AuthWeb3Only setTheme={setTheme} />
        <AuthHideSome setTheme={setTheme} />
        <AuthCustodialFirst setTheme={setTheme} />
        <AuthCustodialOnly setTheme={setTheme} />
      </div>
    </AuthUiProvider>
  );
}