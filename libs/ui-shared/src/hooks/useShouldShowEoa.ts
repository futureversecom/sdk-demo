import { useAuth, useConnector } from '@futureverse/auth-react';
import { useMemo } from 'react';

export function useShouldShowEoa() {
  const { authMethod } = useAuth();
  const { connector } = useConnector();

  const shouldShowEoa = useMemo(() => {
    return connector?.id !== 'xaman' && authMethod === 'eoa';
  }, [connector, authMethod]);

  return shouldShowEoa;
}
