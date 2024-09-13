import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '../../providers/TRNProvider';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount } from '../../hooks';
import { shortAddress } from '../../lib/utils';

export default function IncrementFPass() {
  const { userSession } = useAuth();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();

  const getExtrinsic = useGetExtrinsic();

  const {
    data: contractData,
    refetch,
    isFetching,
    isLoading,
  } = useGetCount(TestContractAddress, TestContractAbi);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const builder = await TransactionBuilder.evm(
      trnApi,
      signer,
      userSession.eoa,
      TestContractAddress
    );

    await builder.writeContract({
      abi: TestContractAbi,
      functionName: 'increment',
      args: undefined,
      fromFuturePass: true,
    });

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [trnApi, signer, userSession, getExtrinsic, setCurrentBuilder]);

  useEffect(() => {
    if (result) {
      refetch();
    }
  }, [result, refetch]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <h3>Increment Counter From FuturePass</h3>
          <small>{shortAddress(userSession?.futurepass ?? '')}</small>
        </div>
        <div className="row">
          <h3>Current Counter</h3>
          <small>
            {isFetching || isLoading
              ? 'Fetching Current Count...'
              : contractData
              ? contractData?.toString()
              : ''}{' '}
          </small>
        </div>
        <div className="row">
          <button
            className="w-full builder-input green"
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={disable}
          >
            Increment Counter
          </button>
        </div>
      </div>
    </div>
  );
}
