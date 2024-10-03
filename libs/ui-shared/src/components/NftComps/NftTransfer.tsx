import { useAuth, useConnector } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { useGetTokens } from '../../hooks';
import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';

const collectionId = 709732;

const codeString = `
import { useAuth, useConnector } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetTokens } from '../../hooks';
import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';

const collectionId = 709732;

export default function NftTransfer() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

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

  const shouldShowEoa = useMemo(() => {
    return connector?.id !== 'xaman' || authMethod !== 'eoa';
  }, [connector, authMethod]);

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
      : ''
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);
  const [slippage, setSlippage] = useState<string>('5');
  const [serialNumber, setSerialNumber] = useState<string>('');

  const [addressInputError, setAddressInputError] = useState<string>('');
  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.futurepass : userSession?.eoa) ?? ''
  );

  const buttonDisabled = useMemo(() => {
    return disable || addressInputError !== '';
  }, [disable, addressInputError]);

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
      collectionId
    ).transfer({
      walletAddress: addressToSend,
      serialNumbers: [Number(serialNumber)],
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
    serialNumber,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={\`card \${disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Transfer Nft</h3>
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
          <AddressToSend
            label="Transfer To"
            addressToSend={addressToSend}
            setAddressToSend={setAddressToSend}
            addressInputError={addressInputError}
            setAddressInputError={setAddressInputError}
            disable={disable}
            resetState={resetState}
          />
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
              <span>No Owned Tokens</span>
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
            className={\`w-full builder-input green \${
              buttonDisabled ? 'disabled' : ''
            }\`}
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={buttonDisabled}
          >
            Transfer Token
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export default function NftTransfer() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();

  const getExtrinsic = useGetExtrinsic();

  const shouldShowEoa = useMemo(() => {
    return connector?.id !== 'xaman' || authMethod !== 'eoa';
  }, [connector, authMethod]);

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
      : ''
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [slippage, setSlippage] = useState<string>('5');
  const [serialNumber, setSerialNumber] = useState<string>('');

  const [addressInputError, setAddressInputError] = useState<string>('');
  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.futurepass : userSession?.eoa) ?? ''
  );

  const buttonDisabled = useMemo(() => {
    return disable || addressInputError !== '';
  }, [disable, addressInputError]);

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
      collectionId
    ).transfer({
      walletAddress: addressToSend,
      serialNumbers: [Number(serialNumber)],
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
    serialNumber,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Transfer Nft</h3>
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
          <AddressToSend
            label="Transfer To"
            addressToSend={addressToSend}
            setAddressToSend={setAddressToSend}
            addressInputError={addressInputError}
            setAddressInputError={setAddressInputError}
            disable={disable}
            resetState={resetState}
          />
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
              <span>No Owned Tokens</span>
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
            className={`w-full builder-input green ${
              buttonDisabled ? 'disabled' : ''
            }`}
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={buttonDisabled}
          >
            Transfer Token
          </button>
        </div>
      </div>
    </div>
  );
}
