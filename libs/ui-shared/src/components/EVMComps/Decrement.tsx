import React, { useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '../../providers/TRNProvider';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount, useShouldShowEoa } from '../../hooks';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import SliderInput from '../SliderInput';
import SendFrom from '../SendFrom';

const codeString = `
import React, { useState } from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '../../providers/TRNProvider';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { TestContractAbi, TestContractAddress } from '../../lib/test-contract';
import { useGetCount } from '../../hooks';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import SliderInput from '../SliderInput';
import SendFrom from '../SendFrom';


export default function Decrement() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const shouldShowEoa = useMemo(() => {
    return connector?.id !== 'xaman' || authMethod !== 'eoa';
  }, [connector, authMethod]);

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

  const getExtrinsic = async (builder: RootTransactionBuilder) => {
    const gasEstimate = await builder?.getGasFees();
    if (gasEstimate) {
      setGas(gasEstimate);
    }
    const payloads = await builder?.getPayloads();
    if (!payloads) {
      return;
    }
    setPayload(payloads);
    const { ethPayload } = payloads;
    setToSign(ethPayload.toString());
  };

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
    <div className={\`card \${disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Decrement Counter</h3>
        </CodeView>

        <div className="row">
          <div>
            <strong>Contract</strong>
          </div>
          <a
            href=\`https://porcini.rootscan.io/addresses/\${TestContractAddress}/contract\`}
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
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: '4px', display: 'inline-flex' }}
              >
                <g id="Interface / External_Link">
                  <path
                    id="Vector"
                    d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
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
              <svg
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: '4px', display: 'inline-flex' }}
              >
                <g id="Interface / External_Link">
                  <path
                    id="Vector"
                    d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
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
