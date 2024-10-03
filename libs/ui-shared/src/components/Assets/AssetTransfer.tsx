import React from 'react';

import { useAuth, useConnector } from '@futureverse/auth-react';
import { TransactionBuilder } from '@futureverse/transact';
import { useCallback, useMemo, useState } from 'react';

import { parseUnits } from 'viem';

import { useTrnApi } from '../../providers/TRNProvider';
import { ASSET_DECIMALS } from '../../helpers';
import { useRootStore } from '../../hooks/useRootStore';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { getBalance, shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import { useTransactQuery } from '../../hooks';
import { useQuery } from '@tanstack/react-query';
import SliderInput from '../SliderInput';

const codeString = `
import React from 'react';

import { useAuth, useConnector } from '@futureverse/auth-react';
import { TransactionBuilder } from '@futureverse/transact';
import { useCallback, useMemo, useState } from 'react';

import { parseUnits } from 'viem';

import { useTrnApi } from '../../providers/TRNProvider';
import { ASSET_DECIMALS } from '../../helpers';
import { useRootStore } from '../../hooks/useRootStore';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { getBalance, shortAddress } from '../../lib/utils';
import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import { useTransactQuery } from '../../hooks';
import { useQuery } from '@tanstack/react-query';


export default function AssetTransfer() {
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

  const [assetId, setAssetId] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.futurepass : userSession?.eoa) ?? ''
  );
  const [slippage, setSlippage] = useState<string>('5');
  const [addressInputError, setAddressInputError] = useState<string>('');

  const transactionQuery = useTransactQuery();

  const { data: userBalance, isFetching } = useQuery({
    queryKey: [
      'balance',
      fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass,
      assetId,
    ],
    queryFn: async () =>
      getBalance(
        transactionQuery,
        (fromWallet === 'eoa'
          ? userSession?.eoa
          : userSession?.futurepass) as string,
        assetId
      ),
    enabled: !!trnApi && !!userSession && !!transactionQuery,
  });

  const buttonDisabled = useMemo(() => {
    return disable || addressInputError !== '';
  }, [disable, addressInputError]);

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

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        builder.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await builder.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await builder.addFeeProxy({
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    amountToSend,
    assetId,
    addressToSend,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={\`card \${disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Transfer Assets</h3>
            <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            >{shortAddress(userSession?.futurepass ?? '')}</span>
          </CodeView>
        </div>
        <div className="row">
          <SendFrom
            label="Transfer From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
            setAddressToSend={setAddressToSend}
          />
        </div>
        <div className="row">
          <label>
            Asset ID
            <input
              type="number"
              value={assetId}
              min={1}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setAssetId(Number(e.target.value));
              }}
            />
          </label>
          {!isFetching && !userBalance && <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            ></span>}
          {isFetching && <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            >Checking User Balance...</span>}
          {userBalance && <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            >Balance: {userBalance}</span>}
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
          <AddressToSend
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
        {feeAssetId !== 2 && <div className="row">
            <SliderInput
              sliderValue={5}
              setSliderValue={5}
              minValue={0}
              sliderStep={0.1}
              maxValue={15}
              resetState={resetState}
            />
          </div>}
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
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

`;

export default function AssetTransfer() {
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

  const [assetId, setAssetId] = useState<number>(1);
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [amountToSend, setAmountToSend] = useState<number>(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.futurepass : userSession?.eoa) ?? ''
  );

  const [slippage, setSlippage] = useState<string>('5');
  const [addressInputError, setAddressInputError] = useState<string>('');

  const transactionQuery = useTransactQuery();

  const { data: userBalance, isFetching } = useQuery({
    queryKey: [
      'balance',
      fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass,
      assetId,
    ],
    queryFn: async () =>
      getBalance(
        transactionQuery,
        (fromWallet === 'eoa'
          ? userSession?.eoa
          : userSession?.futurepass) as string,
        assetId
      ),
    enabled: !!trnApi && !!userSession && !!transactionQuery,
  });

  const buttonDisabled = useMemo(() => {
    return disable || addressInputError !== '';
  }, [disable, addressInputError]);

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
    amountToSend,
    assetId,
    addressToSend,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
    slippage,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Transfer Assets</h3>
            <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
              {shortAddress(userSession?.futurepass ?? '')}
            </span>
          </CodeView>
        </div>
        <div className="row">
          <SendFrom
            label="Transfer From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
            setAddressToSend={setAddressToSend}
          />
        </div>
        <div className="row">
          <label>
            Asset ID
            <input
              type="number"
              value={assetId}
              min={1}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setAssetId(Number(e.target.value));
              }}
            />
          </label>
          {!isFetching && !userBalance && (
            <span
              style={{ display: 'inline-block', fontSize: '0.8rem' }}
            ></span>
          )}
          {isFetching && (
            <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
              Checking User Balance...
            </span>
          )}
          {userBalance && (
            <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
              Balance: {userBalance}
            </span>
          )}
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
          <AddressToSend
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
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
