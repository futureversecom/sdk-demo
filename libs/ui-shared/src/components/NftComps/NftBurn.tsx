'use client';

import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';

import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { useDebounce, useGetTokens, useShouldShowEoa } from '../../hooks';
import CodeView from '../CodeView';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';

const codeString = `
import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';

import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { useDebounce, useGetTokens, useShouldShowEoa } from '../../hooks';
import CodeView from '../CodeView';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';

export default function NftBurn() {
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

  const [collectionId, setCollectionId] = useState<number>(709732);
  const debouncedCollectionId = useDebounce(collectionId, 500);

  const [slippage, setSlippage] = useState<string>('5');

  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const {
    data: ownedTokens,
    isFetching,
    isLoading,
  } = useGetTokens(
    userSession
      ? fromWallet === 'fpass'
        ? userSession?.futurepass
        : userSession?.eoa
      : '',
    debouncedCollectionId
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [serialNumber, setSerialNumber] = useState<string>('');

  useEffect(() => {
    if (ownedTokens && ownedTokens.length > 0) {
      setSerialNumber(ownedTokens[0].toString());
    }
  }, [ownedTokens]);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    if (serialNumber === '') {
      console.log('Missing serial number');
      return;
    }

    const nft = await TransactionBuilder.nft(
      trnApi,
      signer,
      userSession.eoa,
      debouncedCollectionId
    ).burn({
      serialNumber: Number(serialNumber),
    });

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        await nft.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await nft.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await nft.addFeeProxy({
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    getExtrinsic(nft);
    setCurrentBuilder(nft);
  }, [
    trnApi,
    signer,
    userSession,
    serialNumber,
    debouncedCollectionId,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  const buttonDisabled = useMemo(() => {
    return disable || ownedTokens?.length === 0;
  }, [disable, ownedTokens]);

  return (
    <div className={\`card $\{disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Burn Nft</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Burn From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
          />
        </div>
        <div className="row">
          <label>
            Collection Id
            <input
              type="text"
              value={collectionId.toString()}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setCollectionId(Number(e.target.value) || 1);
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Serial Number
            {isFetching || isLoading ? (
              <span> Checking Token Ownership</span>
            ) : ownedTokens && ownedTokens.length > 0 ? (
              <select
                value={serialNumber}
                className="w-full builder-input"
                disabled={disable}
                onChange={e => {
                  resetState();
                  setSerialNumber(e.target.value);
                }}
              >
                {ownedTokens.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <span> - No Owned Tokens</span>
            )}
          </label>
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
            disabled={buttonDisabled}
          >
            Burn Token
          </button>
        </div>
      </div>
    </div>
  );
}
`;
export default function NftBurn() {
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

  const [collectionId, setCollectionId] = useState<number>(709732);
  const debouncedCollectionId = useDebounce(collectionId, 500);

  const [slippage, setSlippage] = useState<string>('5');

  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const {
    data: ownedTokens,
    isFetching,
    isLoading,
  } = useGetTokens(
    userSession
      ? fromWallet === 'fpass'
        ? userSession?.futurepass
        : userSession?.eoa
      : '',
    debouncedCollectionId
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [serialNumber, setSerialNumber] = useState<string>('');

  useEffect(() => {
    if (ownedTokens && ownedTokens.length > 0) {
      setSerialNumber(ownedTokens[0].toString());
    }
  }, [ownedTokens]);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    if (serialNumber === '') {
      console.log('Missing serial number');
      return;
    }

    const nft = await TransactionBuilder.nft(
      trnApi,
      signer,
      userSession.eoa,
      debouncedCollectionId
    ).burn({
      serialNumber: Number(serialNumber),
    });

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        await nft.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await nft.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await nft.addFeeProxy({
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    getExtrinsic(nft);
    setCurrentBuilder(nft);
  }, [
    trnApi,
    signer,
    userSession,
    serialNumber,
    debouncedCollectionId,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  const buttonDisabled = useMemo(() => {
    return disable || ownedTokens?.length === 0;
  }, [disable, ownedTokens]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Burn Nft</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Burn From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
          />
        </div>
        <div className="row">
          <label>
            Collection Id
            <input
              type="text"
              value={collectionId.toString()}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setCollectionId(Number(e.target.value) || 1);
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Serial Number
            {isFetching || isLoading ? (
              <span> Checking Token Ownership</span>
            ) : ownedTokens && ownedTokens.length > 0 ? (
              <select
                value={serialNumber}
                className="w-full builder-input"
                disabled={disable}
                onChange={e => {
                  resetState();
                  setSerialNumber(e.target.value);
                }}
              >
                {ownedTokens.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <span> - No Owned Tokens</span>
            )}
          </label>
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
            disabled={buttonDisabled}
          >
            Burn Token
          </button>
        </div>
      </div>
    </div>
  );
}
