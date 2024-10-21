'use client';
import { AuthUiSdkCustomiser } from '@/components/client-components';
import { authClient } from '../../../Providers/config';
import React from 'react';

export default function Page() {
  return <AuthUiSdkCustomiser authClient={authClient} />;
}
