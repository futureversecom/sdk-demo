'use client';

import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount } from '../../hooks';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';

const codeString = `
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';


import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount } from '../../hooks';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';

export default function DecrementFPass() {
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
    <div>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Decrement Counter From FuturePass</h3>
          <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            >{shortAddress(userSession?.futurepass ?? '')}</span>
        </CodeView>
        <div className="row">
          <div>
            <strong>Current Counter</strong>
          </div>
          <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            >
            {isFetching || isLoading
              ? 'Fetching Current Count...'
              : contractData
              ? contractData?.toString()
              : ''}{' '}
          </span>
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
`;

export default function DecrementFPass() {
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
        <CodeView code={codeString}>
          <h3>Decrement Counter From FuturePass</h3>
          <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
            {shortAddress(userSession?.futurepass ?? '')}
          </span>
        </CodeView>
        <div className="row">
          <div>
            <strong>Current Counter</strong>
          </div>
          <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
            {isFetching || isLoading
              ? 'Fetching Current Count...'
              : contractData
              ? contractData?.toString()
              : ''}{' '}
          </span>
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
