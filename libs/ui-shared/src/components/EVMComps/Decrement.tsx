'use client';

import React, { useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount, useShouldShowEoa } from '../../hooks';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import SliderInput from '../SliderInput';
import SendFrom from '../SendFrom';
import { ExternalLink } from '../Icons';

const codeString = `
import React, { useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount, useShouldShowEoa } from '../../hooks';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import SliderInput from '../SliderInput';
import SendFrom from '../SendFrom';
import { ExternalLink } from '../Icons';


export default function Decrement() {
  const { userSession } = useAuth();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [slippage, setSlippage] = useState<string>('5');

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
      fromFuturePass: fromWallet === 'eoa' ? false : true,
    });

    if (feeAssetId !== 2) {
      await builder.addFeeProxy({
        assetId: feeAssetId,
        slippage: Number(slippage),
      });
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
    slippage,
  ]);

  useEffect(() => {
    if (result) {
      refetch();
    }
  }, [result, refetch]);

  return (
    <div className={\`card $\{disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Decrement Counter</h3>
        </CodeView>

        <div className="row">
          <div>
            <strong>Contract</strong>
          </div>
          <a
            href={\`https://porcini.rootscan.io/addresses/$\{TestContractAddress}/contract\`}
            target="_blank"
            rel="noreferrer"
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.8rem',
                textDecoration: 'underline',
              }}
            >
              View {shortAddress(TestContractAddress ?? '')} on Rootscan
              <div
                style={{
                  width: '18px',
                  display: 'inline-block',
                  marginLeft: '4px',
                  top: '3px',
                  position: 'relative',
                }}
              >
                <ExternalLink />
              </div>
            </span>
          </a>
        </div>
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
          <SendFrom
            label="Decrement From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
          />
        </div>
        <div className="row">
          <label>
            Gas Token
            <select
              value={feeAssetId}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setFeeAssetId(Number(e.target.value));
              }}
            >
              <option value={2}>XRP</option>
              <option value={1}>ROOT</option>
              <option value={3172}>SYLO</option>
              <option value={17508}>ASTO</option>
            </select>
          </label>
        </div>
        {feeAssetId !== 2 && (
          <div className="row">
            <SliderInput
              sliderValue={slippage}
              setSliderValue={setSlippage}
              minValue={0}
              sliderStep={0.1}
              maxValue={15}
              resetState={resetState}
            />
          </div>
        )}
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

export default function Decrement() {
  const { userSession } = useAuth();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [slippage, setSlippage] = useState<string>('5');

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
      fromFuturePass: fromWallet === 'eoa' ? false : true,
    });

    if (feeAssetId !== 2) {
      await builder.addFeeProxy({
        assetId: feeAssetId,
        slippage: Number(slippage),
      });
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
    slippage,
  ]);

  useEffect(() => {
    if (result) {
      refetch();
    }
  }, [result, refetch]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Decrement Counter</h3>
        </CodeView>

        <div className="row">
          <div>
            <strong>Contract</strong>
          </div>
          <a
            href={`https://porcini.rootscan.io/addresses/${TestContractAddress}/contract`}
            target="_blank"
            rel="noreferrer"
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.8rem',
                textDecoration: 'underline',
              }}
            >
              View {shortAddress(TestContractAddress ?? '')} on Rootscan
              <div
                style={{
                  width: '18px',
                  display: 'inline-block',
                  marginLeft: '4px',
                  top: '3px',
                  position: 'relative',
                }}
              >
                <ExternalLink />
              </div>
            </span>
          </a>
        </div>
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
          <SendFrom
            label="Decrement From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
          />
        </div>
        <div className="row">
          <label>
            Gas Token
            <select
              value={feeAssetId}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setFeeAssetId(Number(e.target.value));
              }}
            >
              <option value={2}>XRP</option>
              <option value={1}>ROOT</option>
              <option value={3172}>SYLO</option>
              <option value={17508}>ASTO</option>
            </select>
          </label>
        </div>
        {feeAssetId !== 2 && (
          <div className="row">
            <SliderInput
              sliderValue={slippage}
              setSliderValue={setSlippage}
              minValue={0}
              sliderStep={0.1}
              maxValue={15}
              resetState={resetState}
            />
          </div>
        )}
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
