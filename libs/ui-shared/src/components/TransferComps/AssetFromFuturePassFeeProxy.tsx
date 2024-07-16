import { useAuth } from '@futureverse/auth-react';
import { CustomExtrinsicBuilder } from '@futureverse/transact';
import { useCallback, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { useCustomExtrinsicBuilder } from '../../hooks';
import { useTrnApi } from '../../providers/TRNProvider';
import { ASSET_DECIMALS } from '../../helpers';
import { useRootStore } from '@fv-sdk-demos/store-shared';

export default function AssetFromFuturePassFeeProxy() {
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

  const [assetId, setAssetId] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>('');

  const customExtrinsicBuilder = useCustomExtrinsicBuilder();

  const createCustomBuilder = useCallback(async () => {
    const getExtrinsic = async (builder: CustomExtrinsicBuilder) => {
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

    if (!customExtrinsicBuilder || !userSession) {
      return null;
    }
    console.log('Creating Custom Extrinsic');
    console.log('customExtrinsicBuilder', customExtrinsicBuilder);

    const valueToSend = ethers.parseUnits(
      amountToSend.toString(),
      ASSET_DECIMALS[assetId]
    );

    const extrinsic = trnApi?.tx?.assetsExt?.transfer(
      assetId,
      addressToSend,
      valueToSend.toString(),
      true
    );

    if (!extrinsic) {
      return;
    }

    await customExtrinsicBuilder.extrinsic(extrinsic).addFuturePassAndFeeProxy({
      futurePass: userSession.futurepass,
      assetId: feeAssetId,
      slippage: 5,
    });

    getExtrinsic(customExtrinsicBuilder);
    setCurrentBuilder(customExtrinsicBuilder);
  }, [
    addressToSend,
    amountToSend,
    assetId,
    customExtrinsicBuilder,
    feeAssetId,
    setCurrentBuilder,
    setGas,
    setPayload,
    setToSign,
    trnApi?.tx?.assetsExt,
    userSession,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <h3>Send From FuturePass Using Fee Proxy</h3>
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
              createCustomBuilder();
            }}
          >
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
