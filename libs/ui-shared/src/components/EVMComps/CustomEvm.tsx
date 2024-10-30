'use client';

import React, { useCallback, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useMemo } from 'react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { useRootStore } from '../../hooks/useRootStore';
import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import { TransactionBuilder } from '@futureverse/transact';
import SliderInput from '../SliderInput';

export default function CustomEvm() {
  const { userSession } = useAuth();

  const [assetId, setAssetId] = useState<number>(1);
  const [evmContractAddress, setEvmContractAddress] = useState(
    '0xb271a5C4e7628fA6F9b9A55EC889a8072e8E0E62'
  );
  const [evmUseFuturePass, setEvmUseFuturePass] = useState(false);
  const [evmArgs, setEvmArgs] = useState('');
  const [evmFunctionName, setEvmFunctionName] = useState('increment');
  const [slippage, setSlippage] = useState('5');
  const [evmAbi, setEvmAbi] = useState(
    JSON.stringify([
      {
        type: 'function',
        name: 'decrement',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'getNumber',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'increment',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'number',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'reset',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'setNumber',
        inputs: [
          {
            name: 'newNumber',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'event',
        name: 'NumberChanged',
        inputs: [
          {
            name: 'newNumber',
            type: 'uint256',
            indexed: false,
            internalType: 'uint256',
          },
        ],
        anonymous: false,
      },
    ])
  );

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();

  const getExtrinsic = useGetExtrinsic();

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    if (!trnApi || !signer || !userSession) {
      return null;
    }

    const evmBuilder = await TransactionBuilder.evm(
      trnApi,
      signer,
      userSession.eoa,
      evmContractAddress
    );

    await evmBuilder.writeContract({
      abi: JSON.parse(evmAbi),
      functionName: evmFunctionName,
      args: evmArgs.length > 0 ? evmArgs.split(',') : undefined,
      fromFuturePass: evmUseFuturePass,
    });

    if (assetId !== 2) {
      await evmBuilder.addFeeProxy({
        assetId: assetId,
        slippage: slippage === '' ? 5 : Number(slippage),
      });
    }

    getExtrinsic(evmBuilder);
    setCurrentBuilder(evmBuilder);
  }, [
    trnApi,
    signer,
    userSession,
    evmContractAddress,
    evmFunctionName,
    evmAbi,
    evmArgs,
    evmUseFuturePass,
    assetId,
    getExtrinsic,
    setCurrentBuilder,
    slippage,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''} custom-card span-4`}>
      <div className="inner">
        <div className="row">
          <h3>Custom EVM Interaction</h3>
        </div>
        <div className="grid custom-evm">
          <div className="col col-2">
            <div className="row">
              <label>
                Contract Address
                <input
                  name="evmContractAddress"
                  value={evmContractAddress}
                  onChange={e => {
                    resetState();
                    setEvmContractAddress(e.target.value);
                  }}
                  className="w-full builder-input"
                />
              </label>
            </div>
            <div className="row">
              <label>
                Function Name
                <input
                  name="evmFunctionName"
                  value={evmFunctionName}
                  onChange={e => {
                    resetState();
                    setEvmFunctionName(e.target.value);
                  }}
                  className="w-full builder-input"
                />
              </label>
            </div>
          </div>
          <div className="col col-1">
            <div className="row">
              <label>
                Abi
                <textarea
                  value={evmAbi}
                  onChange={e => {
                    resetState();
                    setEvmAbi(e.target.value);
                  }}
                  className="w-full builder-input"
                  style={{
                    height: '200px',
                    width: '100%',
                    border: '1px solid #ccc',
                  }}
                  draggable={false}
                  wrap="on"
                />
              </label>
            </div>
          </div>
          <div className="col col-1">
            <div className="row">
              <label>
                Args
                <textarea
                  value={evmArgs}
                  onChange={e => {
                    resetState();
                    setEvmArgs(e.target.value);
                  }}
                  className="w-full builder-input"
                  style={{
                    height: '200px',
                    width: '100%',
                    border: '1px solid #ccc',
                  }}
                  draggable={false}
                  wrap="on"
                />
              </label>
            </div>
          </div>
          <div className="col col-2">
            <div className="row">
              <label>
                Use FuturePass
                <select
                  value={evmUseFuturePass.toString()}
                  className="w-full builder-input"
                  onChange={e => {
                    resetState();
                    setEvmUseFuturePass(
                      e.target.value === 'true' ? true : false
                    );
                  }}
                >
                  <option value={'true'}>Use FuturePass</option>
                  <option value={'false'}>Do Not Use FuturePass</option>
                </select>
              </label>
            </div>
            <div className="row">
              <label>
                Gas Token
                <select
                  value={assetId}
                  className="w-full builder-input"
                  onChange={e => {
                    resetState();
                    setAssetId(Number(e.target.value));
                  }}
                >
                  <option value={2}>XRP</option>
                  <option value={1}>ROOT</option>
                  <option value={3172}>SYLO</option>
                  <option value={17508}>ASTO</option>
                </select>
              </label>
            </div>
            {assetId !== 2 && (
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
          </div>
          <div className="col span-4">
            <div className="row">
              <button
                className="w-full builder-input green"
                onClick={() => {
                  resetState();
                  createBuilder();
                }}
                disabled={disable}
              >
                Custom EVM Extrinsic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
