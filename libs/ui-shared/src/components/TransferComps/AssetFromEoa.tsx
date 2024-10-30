'use client';

import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useMemo, useState } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { ASSET_DECIMALS } from '../../helpers';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { parseUnits } from 'viem';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';

const codeString = `
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useCallback, useMemo, useState } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { ASSET_DECIMALS } from '../../helpers';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { parseUnits } from 'viem';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';


export default function AssetFromEoa() {
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

  const [assetId, setAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    userSession?.futurepass ?? ''
  );

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const valueToSend = parseUnits(
      amountToSend.toString(),
      ASSET_DECIMALS[assetId]
    );

    const builder = await TransactionBuilder.asset(
      trnApi,
      signer,
      userSession.eoa,
      assetId
    ).transfer({
      destinationAddress: addressToSend,
      amount: parseInt(valueToSend.toString()),
    });

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    addressToSend,
    trnApi,
    signer,
    userSession,
    amountToSend,
    assetId,
    getExtrinsic,
    setCurrentBuilder,
  ]);

  return (
    <div className={\`card $\{disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Send From EOA</h3>
            <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
              {shortAddress(userSession?.eoa ?? '')}
            </span>
          </CodeView>
        </div>
        <div className="row">
          <label>
            Amount
            <input
              type="number"
              value={amountToSend}
              min={1}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setAmountToSend(Number(e.target.value));
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Currency
            <select
              value={assetId}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setAssetId(Number(e.target.value));
              }}
              disabled={disable}
            >
              <option value={1}>ROOT</option>
              <option value={2}>XRP</option>
              <option value={3172}>SYLO</option>
              <option value={17508}>ASTO</option>
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            Send To
            <input
              type="text"
              value={addressToSend}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setAddressToSend(e.target.value);
              }}
              disabled={disable}
            />
          </label>
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
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export default function AssetFromEoa() {
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

  const [assetId, setAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    userSession?.futurepass ?? ''
  );

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const valueToSend = parseUnits(
      amountToSend.toString(),
      ASSET_DECIMALS[assetId]
    );

    const builder = await TransactionBuilder.asset(
      trnApi,
      signer,
      userSession.eoa,
      assetId
    ).transfer({
      destinationAddress: addressToSend,
      amount: parseInt(valueToSend.toString()),
    });

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    addressToSend,
    trnApi,
    signer,
    userSession,
    amountToSend,
    assetId,
    getExtrinsic,
    setCurrentBuilder,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Send From EOA</h3>
            <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
              {shortAddress(userSession?.eoa ?? '')}
            </span>
          </CodeView>
        </div>
        <div className="row">
          <label>
            Amount
            <input
              type="number"
              value={amountToSend}
              min={1}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setAmountToSend(Number(e.target.value));
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Currency
            <select
              value={assetId}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setAssetId(Number(e.target.value));
              }}
              disabled={disable}
            >
              <option value={1}>ROOT</option>
              <option value={2}>XRP</option>
              <option value={3172}>SYLO</option>
              <option value={17508}>ASTO</option>
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            Send To
            <input
              type="text"
              value={addressToSend}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setAddressToSend(e.target.value);
              }}
              disabled={disable}
            />
          </label>
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
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
