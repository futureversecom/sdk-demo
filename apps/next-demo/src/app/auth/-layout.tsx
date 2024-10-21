'use client';

import React from 'react';

import { authClient } from '../../Providers/config';

import { AuthUiProvider, DarkTheme, ThemeConfig } from '@futureverse/auth-ui';

const customTheme: ThemeConfig = {
  ...DarkTheme,
  defaultAuthOption: 'custodial',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthUiProvider themeConfig={customTheme} authClient={authClient}>
      {children}
    </AuthUiProvider>
  );
}
