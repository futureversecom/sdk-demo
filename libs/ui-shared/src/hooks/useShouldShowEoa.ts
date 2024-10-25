import { useAuth, useConnector } from '@futureverse/auth-react';
import { useMemo } from 'react';

export function useShouldShowEoa() {
  const { authMethod } = useAuth();
  const { connector } = useConnector();

  const shouldShowEoa = useMemo(() => {
    let should = false;
    if (!connector || !authMethod) {
      return should;
    }
    if (connector?.id !== 'xaman' && authMethod === 'eoa') {
      should = true;
    }
    return should;
  }, [connector, authMethod]);

  return shouldShowEoa;
}
