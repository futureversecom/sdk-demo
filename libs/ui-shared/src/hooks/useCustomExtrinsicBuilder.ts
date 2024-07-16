import { useMemo } from 'react';

import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { CustomExtrinsicBuilder } from '@futureverse/transact';
import { useTrnApi } from '../providers';

export function useCustomExtrinsicBuilder() {
  const { userSession } = useAuth();

  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();

  const customExtrinsicBuilder = useMemo(() => {
    if (!trnApi || !signer || !userSession) {
      return null;
    }
    const builder = new CustomExtrinsicBuilder(
      trnApi,
      signer,
      userSession?.eoa
    );
    return builder;
  }, [signer, trnApi, userSession]);

  return customExtrinsicBuilder;
}
