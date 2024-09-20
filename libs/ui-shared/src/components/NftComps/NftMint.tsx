import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';

const collectionId = 709732;

const codeString = `
import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';

const collectionId = 709732;

export default function NftMint() {
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

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>('eoa');
  const [mintQty, setMintQty] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [addressToSend, setAddressToSend] = useState<string>(
    userSession?.futurepass || ''
  );

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const nft = await TransactionBuilder.nft(
      trnApi,
      signer,
      userSession.eoa,
      collectionId
    ).mint({
      walletAddress: addressToSend,
      quantity: mintQty,
    });

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        nft.addFuturePass(userSession.futurepass);
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
    addressToSend,
    mintQty,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Mint Nft</h3>
          <small>Collection ID: {collectionId}</small>
        </CodeView>
        <div className="row">
          <label>
            Mint From
            <select
              value={fromWallet}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setFromWallet(e.target.value as 'eoa' | 'fpass');
                setAddressToSend(
                  userSession
                    ? e.target.value === 'eoa'
                      ? userSession?.futurepass
                      : userSession?.eoa
                    : ''
                );
              }}
            >
              <option value="eoa">EOA</option>
              <option value="fpass">FuturePass</option>
            </select>
          </label>
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
            Mint Qty
            <input
              type="text"
              value={mintQty}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setMintQty(Number(e.target.value) || 1);
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
              <option value={2}>XRP</option>
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
`;

export default function NftMint() {
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

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>('eoa');
  const [mintQty, setMintQty] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [addressToSend, setAddressToSend] = useState<string>(
    userSession?.futurepass || ''
  );

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const nft = await TransactionBuilder.nft(
      trnApi,
      signer,
      userSession.eoa,
      collectionId
    ).mint({
      walletAddress: addressToSend,
      quantity: mintQty,
    });

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        nft.addFuturePass(userSession.futurepass);
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
    addressToSend,
    mintQty,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Mint Nft</h3>
          <small>Collection ID: {collectionId}</small>
        </CodeView>
        <div className="row">
          <label>
            Mint From
            <select
              value={fromWallet}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setFromWallet(e.target.value as 'eoa' | 'fpass');
                setAddressToSend(
                  userSession
                    ? e.target.value === 'eoa'
                      ? userSession?.futurepass
                      : userSession?.eoa
                    : ''
                );
              }}
            >
              <option value="eoa">EOA</option>
              <option value="fpass">FuturePass</option>
            </select>
          </label>
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
            Mint Qty
            <input
              type="text"
              value={mintQty}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setMintQty(Number(e.target.value) || 1);
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
              <option value={2}>XRP</option>
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
