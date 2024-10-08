import { useAuth, useConnector } from '@futureverse/auth-react';
import { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';
import SliderInput from '../SliderInput';
import SendFrom from '../SendFrom';
import { AddressToSend } from '../AddressToSend';

const codeString = `
import { useAuth, useConnector } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '../../providers/TRNProvider';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import SliderInput from '../SliderInput';
import SendFrom from '../SendFrom';
import { AddressToSend } from '../AddressToSend';

export default function CustomExtrinsic() {
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

  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [slippage, setSlippage] = useState<string>('5');
  const [addressInputError, setAddressInputError] = useState<string>('');

  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.futurepass : userSession?.eoa) ?? ''
  );

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
    ).fromExtrinsic(extrinsic);

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        builder.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await builder.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await builder.addFeeProxy({
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    addressToSend,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
    slippage,
  ]);

  const buttonDisabled = useMemo(() => {
    return disable || addressInputError !== '';
  }, [disable, addressInputError]);

  return (
    <div className={\`card \${disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Mint Nft Using Custom Extrinsic Builder</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Mint From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
            setAddressToSend={setAddressToSend}
          />
        </div>
        <div className="row">
          <AddressToSend
            label="Mint To"
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
            Mint Token
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export default function CustomExtrinsic() {
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

  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [slippage, setSlippage] = useState<string>('5');
  const [addressInputError, setAddressInputError] = useState<string>('');

  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.futurepass : userSession?.eoa) ?? ''
  );

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
    ).fromExtrinsic(extrinsic);

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        builder.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await builder.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await builder.addFeeProxy({
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    addressToSend,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
    slippage,
  ]);

  const buttonDisabled = useMemo(() => {
    return disable || addressInputError !== '';
  }, [disable, addressInputError]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Mint Nft Using Custom Extrinsic Builder</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Mint From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
            setAddressToSend={setAddressToSend}
          />
        </div>
        <div className="row">
          <AddressToSend
            label="Mint To"
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
            Mint Token
          </button>
        </div>
      </div>
    </div>
  );
}
