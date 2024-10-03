import React from 'react';

import { useAuth } from '@futureverse/auth-react';
import { TransactionBuilder } from '@futureverse/transact';
import { useCallback, useMemo, useState } from 'react';

import { parseUnits } from 'viem';

import { useTrnApi } from '../../providers/TRNProvider';
import { ASSET_DECIMALS } from '../../helpers';
import { useRootStore } from '../../hooks/useRootStore';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';

const codeString = `
import React from 'react';

import { useAuth } from '@futureverse/auth-react';
import { TransactionBuilder } from '@futureverse/transact';
import { useCallback, useMemo, useState } from 'react';

import { parseUnits } from 'viem';

import { useTrnApi } from '../../providers/TRNProvider';
import { ASSET_DECIMALS } from '../../helpers';
import { useRootStore } from '../../hooks/useRootStore';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';

export default function AssetFromFuturePassFeeProxy() {
  const { userSession } = useAuth();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const { trnApi } = useTrnApi();

  const signer = useFutureverseSigner();

  const [assetId, setAssetId] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    userSession?.eoa ?? ''
  );

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
    )
      .transfer({
        destinationAddress: addressToSend,
        amount: parseInt(valueToSend.toString()),
      })
      .addFuturePassAndFeeProxy({
        futurePass: userSession.futurepass,
        assetId: feeAssetId,
        slippage: 5,
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
    feeAssetId,
    getExtrinsic,
    setCurrentBuilder,
  ]);

  return (
    <div>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Send From FuturePass Using Fee Proxy</h3>
            <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            >{shortAddress(userSession?.futurepass ?? '')}</span>
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
              disabled={disable}
              onChange={e => {
                resetState();
                setAmountToSend(Number(e.target.value));
              }}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Currency
            <select
              value={assetId}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setAssetId(Number(e.target.value));
              }}
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
              disabled={disable}
              onChange={e => {
                resetState();
                setAddressToSend(e.target.value);
              }}
            />
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
              <option value={1}>ROOT</option>
              <option value={3172}>SYLO</option>
              <option value={17508}>ASTO</option>
            </select>
          </label>
        </div>
        <div className="row">
          <button
            className="w-full builder-input green"
            disabled={disable}
            onClick={() => {
              resetState();
              createBuilder();
            }}
          >
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export default function AssetFromFuturePassFeeProxy() {
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
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    userSession?.eoa ?? ''
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
    )
      .transfer({
        destinationAddress: addressToSend,
        amount: parseInt(valueToSend.toString()),
      })
      .addFuturePassAndFeeProxy({
        futurePass: userSession.futurepass,
        assetId: feeAssetId,
        slippage: 5,
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
    feeAssetId,
    getExtrinsic,
    setCurrentBuilder,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Send From FuturePass Using Fee Proxy</h3>
            <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
              {shortAddress(userSession?.futurepass ?? '')}
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
              disabled={disable}
              onChange={e => {
                resetState();
                setAmountToSend(Number(e.target.value));
              }}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Currency
            <select
              value={assetId}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setAssetId(Number(e.target.value));
              }}
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
              disabled={disable}
              onChange={e => {
                resetState();
                setAddressToSend(e.target.value);
              }}
            />
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
              <option value={1}>ROOT</option>
              <option value={3172}>SYLO</option>
              <option value={17508}>ASTO</option>
            </select>
          </label>
        </div>
        <div className="row">
          <button
            className="w-full builder-input green"
            disabled={disable}
            onClick={() => {
              resetState();
              createBuilder();
            }}
          >
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
