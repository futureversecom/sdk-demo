import React from 'react';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';

import {
  CustomExtrinsicBuilder,
  TransactionBuilder,
} from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

export default function CustomFromEoaFuturePassFeeProxy() {
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

  const [feeAssetId, setFeeAssetId] = useState<number>(1);

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

    const custom = new CustomExtrinsicBuilder(trnApi, signer, userSession.eoa);

    const extrinsic = trnApi.tx.nft.mint(709732, 1, addressToSend);

    custom.extrinsic(extrinsic).addFuturePassAndFeeProxy({
      futurePass: userSession.futurepass,
      assetId: feeAssetId,
      slippage: 5,
    });

    getExtrinsic(custom);
    setCurrentBuilder(custom);
  }, [
    addressToSend,
    trnApi,
    signer,
    userSession,
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
          <h3>Mint Nft Using Custom Extrinsic</h3>
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
