import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '../../hooks/useFutureverseSigner';

import { useTrnApi } from '../../providers/TRNProvider';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount } from '../../hooks';
import { shortAddress } from '../../lib/utils';

export default function Decrement() {
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
      functionName: 'decrement',
      args: undefined,
      fromFuturePass: false,
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
          <h3>Decrement Counter From EOA</h3>
          <small>{shortAddress(userSession?.eoa ?? '')}</small>
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
            Decrement Counter
          </button>
        </div>
      </div>
    </div>
  );
}
