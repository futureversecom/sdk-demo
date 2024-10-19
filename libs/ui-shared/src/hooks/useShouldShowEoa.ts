import { useAuth, useConnector } from '@futureverse/auth-react';
import { useMemo } from 'react';

export function useShouldShowEoa() {
  const { authMethod } = useAuth();
  const { connector } = useConnector();

  const shouldShowEoa = useMemo(() => {
    return connector?.id !== 'xaman' && authMethod === 'eoa';
  }, [connector, authMethod]);

  console.log('connector?.id', connector?.id, connector?.id !== 'xaman');
  console.log('authMethod', authMethod, authMethod === 'eoa');
  console.log('shouldShowEoa', shouldShowEoa);

  return shouldShowEoa;
}
