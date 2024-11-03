'use client';

import React, { useEffect } from 'react';
import { useIsMounted } from '../hooks';

import { AuthUiCustomiser } from './Auth';

export default function AuthUiSdkCustomiser() {
  const isMounted = useIsMounted();

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
    <>
      <h1>Auth UI SDK Demo</h1>
      <div className="ui-customiser-wrapper">
        <AuthUiCustomiser />
      </div>
    </>
  );
}
