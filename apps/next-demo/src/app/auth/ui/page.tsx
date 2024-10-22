'use client';
import { AuthUiSdk } from '@/components/client-components';
import { authClient } from '../../../Providers/config';
import React from 'react';

export default function Page() {
  return <AuthUiSdk authClient={authClient} />;
}
