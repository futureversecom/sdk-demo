'use client';

import { useAuth, useConnector } from '@futureverse/auth-react';
import { useMemo } from 'react';

export function useShouldShowEoa() {
  const auth = useAuth();
  const { connector } = useConnector();

  const shouldShowEoa = useMemo(() => {
    let should = false;
    if (!connector || !auth?.authMethod) {
      return should;
    }
    if (connector?.id !== 'xaman' && auth?.authMethod === 'eoa') {
      should = true;
    }
    return should;
  }, [connector, auth?.authMethod]);

  return shouldShowEoa;
}
