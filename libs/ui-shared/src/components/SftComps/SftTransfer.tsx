'use client';

import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import {
  useDebounce,
  useGetSftUserTokens,
  useShouldShowEoa,
} from '../../hooks';
import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';

const codeString = `
import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { useDebounce, useGetSftUserTokens, useShouldShowEoa } from '../../hooks';
import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';

export default function NftTransfer() {
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

  const shouldShowEoa = useShouldShowEoa();

  const [collectionId, setCollectionId] = useState<number>(834660);
  const collectionIdDebounced = useDebounce(collectionId, 500);

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [slippage, setSlippage] = useState<string>('5');

  const [addressInputError, setAddressInputError] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const { data: collectionTokens, isPending } = useGetSftUserTokens(
    collectionIdDebounced,
    fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass
  );

  const buttonDisabled = useMemo(() => {
    return (
      disable || addressInputError !== '' || collectionTokens?.length === 0
    );
  }, [disable, addressInputError, collectionTokens]);

  const [tokenQty, setTokenQty] = useState<Array<[number, number]>>([]);

  // useEffect(() => {
  //   if (collectionTokens && collectionTokens.length > 0) {
  //     setTokenQty([[collectionTokens[0].id, 0]]);
  //   }
  // }, [collectionTokens]);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    if (tokenQty.length === 0) {
      console.log('Missing serial number');
      return;
    }

    const nft = await TransactionBuilder.sft(
      trnApi,
      signer,
      userSession.eoa,
      collectionId
    ).transfer({
      walletAddress: transferTo,
      serialNumbers: tokenQty.map(([tokenId, quantity]) => ({
        tokenId,
        quantity,
      })),
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
    tokenQty,
    collectionId,
    transferTo,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={\`card $\{disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Transfer Sft</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Transfer From"
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
        {tokenQty.map((token, index) => (
          <div
            className="row"
            style={{
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: '3fr 3fr 1fr',
              marginTop: '8px',
            }}
            key={index}
          >
            <label>
              Token ID
              <select
                className="w-full builder-input"
                disabled={isPending}
                value={token[0]}
                style={{ marginTop: '4px' }}
                onChange={e => {
                  setTokenQty([
                    ...tokenQty.slice(0, index),
                    [Number(e.target.value), token[1]],
                    ...tokenQty.slice(index + 1),
                  ]);
                }}
              >
                {isPending && <option value="">Tokens Loading</option>}
                {collectionTokens &&
                  collectionTokens.map((token, index) => (
                    <option key={index} value={token.id}>
                      {token.tokenName}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                value={token[1]}
                min={1}
                max={collectionTokens
                  ?.find(col => col.id === token[0])
                  ?.freeBalance?.toString()}
                className="w-full builder-input"
                style={{ marginTop: '4px' }}
                onChange={e => {
                  const max = collectionTokens?.find(
                    col => col.id === token[0]
                  )?.freeBalance;
                  const maxNumber = parseInt(max ?? '0');

                  if (parseInt(e.target.value) <= maxNumber) {
                    setTokenQty([
                      ...tokenQty.slice(0, index),
                      [token[0], Number(e.target.value)],
                      ...tokenQty.slice(index + 1),
                    ]);
                  }
                }}
              />
            </label>
            <button
              style={{ top: '6px', position: 'relative', cursor: 'pointer' }}
              className="w-full builder-input green"
              onClick={() => {
                setTokenQty([
                  ...tokenQty.slice(0, index),
                  ...tokenQty.slice(index + 1),
                ]);
              }}
            >
              -
            </button>
          </div>
        ))}
        <div className="row">
          <button
            style={{ marginTop: '8px', cursor: 'pointer' }}
            className="w-full builder-input green"
            onClick={() => {
              if (
                collectionTokens &&
                tokenQty.length < collectionTokens?.length
              ) {
                setTokenQty([...tokenQty, [0, 1]]);
              }
            }}
          >
            +
          </button>
        </div>

        <div className="row">
          <AddressToSend
            label="Transfer To"
            addressToSend={transferTo}
            setAddressToSend={setTransferTo}
            addressInputError={addressInputError}
            setAddressInputError={setAddressInputError}
            disable={disable}
            resetState={resetState}
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
            className={\`w-full builder-input green $\{
              buttonDisabled ? 'disabled' : ''
            }\`}
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={buttonDisabled}
          >
            Transfer Token/s
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export default function NftTransfer() {
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

  const shouldShowEoa = useShouldShowEoa();

  const [collectionId, setCollectionId] = useState<number>(834660);
  const collectionIdDebounced = useDebounce(collectionId, 500);

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [slippage, setSlippage] = useState<string>('5');

  const [addressInputError, setAddressInputError] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const { data: collectionTokens, isPending } = useGetSftUserTokens(
    collectionIdDebounced,
    fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass
  );

  const buttonDisabled = useMemo(() => {
    return (
      disable || addressInputError !== '' || collectionTokens?.length === 0
    );
  }, [disable, addressInputError, collectionTokens]);

  const [tokenQty, setTokenQty] = useState<Array<[number, number]>>([]);

  // useEffect(() => {
  //   if (collectionTokens && collectionTokens.length > 0) {
  //     setTokenQty([[collectionTokens[0].id, 0]]);
  //   }
  // }, [collectionTokens]);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    if (tokenQty.length === 0) {
      console.log('Missing serial number');
      return;
    }

    const nft = await TransactionBuilder.sft(
      trnApi,
      signer,
      userSession.eoa,
      collectionId
    ).transfer({
      walletAddress: transferTo,
      serialNumbers: tokenQty.map(([tokenId, quantity]) => ({
        tokenId,
        quantity,
      })),
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
    tokenQty,
    collectionId,
    transferTo,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Transfer Sft</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Transfer From"
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
        {tokenQty.map((token, index) => (
          <div
            className="row"
            style={{
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: '3fr 3fr 1fr',
              marginTop: '8px',
            }}
            key={index}
          >
            <label>
              Token ID
              <select
                className="w-full builder-input"
                disabled={isPending}
                value={token[0]}
                style={{ marginTop: '4px' }}
                onChange={e => {
                  setTokenQty([
                    ...tokenQty.slice(0, index),
                    [Number(e.target.value), token[1]],
                    ...tokenQty.slice(index + 1),
                  ]);
                }}
              >
                {isPending && <option value="">Tokens Loading</option>}
                {collectionTokens &&
                  collectionTokens.map((token, index) => (
                    <option key={index} value={token.id}>
                      {token.tokenName}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Quantity
              <input
                type="number"
                value={token[1]}
                min={1}
                max={collectionTokens
                  ?.find(col => col.id === token[0])
                  ?.freeBalance?.toString()}
                className="w-full builder-input"
                style={{ marginTop: '4px' }}
                onChange={e => {
                  const max = collectionTokens?.find(
                    col => col.id === token[0]
                  )?.freeBalance;
                  const maxNumber = parseInt(max ?? '0');

                  if (parseInt(e.target.value) <= maxNumber) {
                    setTokenQty([
                      ...tokenQty.slice(0, index),
                      [token[0], Number(e.target.value)],
                      ...tokenQty.slice(index + 1),
                    ]);
                  }
                }}
              />
            </label>
            <button
              style={{ top: '6px', position: 'relative', cursor: 'pointer' }}
              className="w-full builder-input green"
              onClick={() => {
                setTokenQty([
                  ...tokenQty.slice(0, index),
                  ...tokenQty.slice(index + 1),
                ]);
              }}
            >
              -
            </button>
          </div>
        ))}
        <div className="row">
          <button
            style={{ marginTop: '8px', cursor: 'pointer' }}
            className="w-full builder-input green"
            onClick={() => {
              if (
                collectionTokens &&
                tokenQty.length < collectionTokens?.length
              ) {
                setTokenQty([...tokenQty, [0, 1]]);
              }
            }}
          >
            +
          </button>
        </div>

        <div className="row">
          <AddressToSend
            label="Transfer To"
            addressToSend={transferTo}
            setAddressToSend={setTransferTo}
            addressInputError={addressInputError}
            setAddressInputError={setAddressInputError}
            disable={disable}
            resetState={resetState}
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
            className={`w-full builder-input green ${
              buttonDisabled ? 'disabled' : ''
            }`}
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={buttonDisabled}
          >
            Transfer Token/s
          </button>
        </div>
      </div>
    </div>
  );
}
