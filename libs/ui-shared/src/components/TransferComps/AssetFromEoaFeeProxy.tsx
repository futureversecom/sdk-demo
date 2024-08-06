import React from 'react';

import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { TransactionBuilder } from '@futureverse/transact';
import { useCallback, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { useTrnApi } from '../../providers/TRNProvider';
import { ASSET_DECIMALS } from '../../helpers';
import { useRootStore } from '../../hooks/useRootStore';

export default function AssetFromEoaFeeProxy() {
  const { userSession } = useAuth();

  const {
    setGas,
    setPayload,
    setToSign,
    resetState,
    setCurrentBuilder,
    signed,
    result,
  } = useRootStore(state => state);

  const disable = useMemo(() => {
    return signed && !result;
  }, [signed, result]);

  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();

  const [assetId, setAssetId] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>('');

  const createBuilder = useCallback(async () => {
    console.log(addressToSend, trnApi, signer, userSession);

    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const getExtrinsic = async (builder: TransactionBuilder) => {
      console.log('Getting Extrinsic');

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

    const valueToSend = ethers.parseUnits(
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
      .addFeeProxy({ assetId: feeAssetId, slippage: 5 });

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    amountToSend,
    assetId,
    addressToSend,
    feeAssetId,
    setCurrentBuilder,
    setPayload,
    setToSign,
    setGas,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <h3>Send From EOA Using Fee Proxy</h3>
          <small>{userSession.eoa}</small>
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
