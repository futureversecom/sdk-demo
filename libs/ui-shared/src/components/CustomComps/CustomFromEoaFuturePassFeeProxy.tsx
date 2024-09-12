import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '../../hooks/useFutureverseSigner';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';

export default function CustomFromEoaFuturePassFeeProxy() {
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

  const [feeAssetId, setFeeAssetId] = useState<number>(1);

  const [addressToSend, setAddressToSend] = useState<string>('');

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const extrinsic = trnApi.tx.nft.mint(709732, 1, addressToSend);

    const builder = await TransactionBuilder.custom(
      trnApi,
      signer,
      userSession.eoa
    )
      .fromExtrinsic(extrinsic)
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
    feeAssetId,
    getExtrinsic,
    setCurrentBuilder,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <h3>Mint Nft Using Custom Extrinsic</h3>
          <small>{userSession?.futurepass}</small>
        </div>
        <div className="row">
          <label>
            Mint To
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
            Mint Token
          </button>
        </div>
      </div>
    </div>
  );
}
