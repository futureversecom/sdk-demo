'use client';
import { AuthSDK } from '@/components/client-components';
import { authClient } from '../../Providers/config';
import React from 'react';

export default function Page() {
  return <AuthSDK authClient={authClient} />;
}
