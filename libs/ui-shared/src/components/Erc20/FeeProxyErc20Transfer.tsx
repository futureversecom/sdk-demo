'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import {
  useDebounce,
  useEvmGetBalance,
  useEvmGetDecimals,
  useShouldShowEoa,
} from '../../hooks';
import { ASSET_ID, erc20AddressToAssetId, shortAddress } from '../../lib/utils';
import { formatUnits, parseAbi, parseUnits } from 'viem';
import {
  assetIdToERC20Address,
  ERC20_PRECOMPILE_ABI,
} from '@therootnetwork/evm';

import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SliderInput from '../SliderInput';
import { CurrentChainSwap } from '../CurrentChainSwap';
import { EvmModal } from '../EvmModal';

const codeString = `
import React, { useMemo, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import {
  useDebounce,
  useEvmGetBalance,
  useEvmGetDecimals,
  useShouldShowEoa,
} from '../../hooks';
import { ASSET_ID, erc20AddressToAssetId, shortAddress } from '../../lib/utils';
import { formatUnits, parseAbi, parseUnits } from 'viem';
import {
  assetIdToERC20Address,
  ERC20_PRECOMPILE_ABI,
} from '@therootnetwork/evm';

import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SliderInput from '../SliderInput';
import { CurrentChainSwap } from '../CurrentChainSwap';
import { EvmModal } from '../EvmModal';

export default function FeeProxyErc20Transfer() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const fromWallet = 'eoa';

  const [assetId, setAssetId] = useState(1);
  const [assetContract, setAssetContract] = useState<\`0x$\{string}\`>(
    '0xcCcCCccC00000001000000000000000000000000'
  );
  const contractDebounced = useDebounce(assetContract ?? '', 500);
  const [feeAssetId, setFeeAssetId] = useState(1);
  const [amountToSend, setAmountToSend] = useState(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa'
      ? userSession?.futurepass
      : shouldShowEoa
      ? userSession?.eoa
      : '') ?? ''
  );
  const [slippage, setSlippage] = useState('5');
  const [addressInputError, setAddressInputError] = useState('');

  const { data: decimals } = useEvmGetDecimals(contractDebounced);
  const { data: userBalance, isFetching } = useEvmGetBalance(
    contractDebounced,
    fromWallet
  );

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(
    () =>
      addressInputError !== '' ||
      addressToSend === '' ||
      amountToSend <= 0 ||
      !userBalance ||
      Number(formatUnits(userBalance as bigint, decimals as number)) <=
        amountToSend ||
      isFetching ||
      !decimals ||
      !assetContract ||
      !contractDebounced,
    [
      addressInputError,
      addressToSend,
      amountToSend,
      userBalance,
      isFetching,
      decimals,
      assetContract,
      contractDebounced,
    ]
  );

  const resetState = () => {
    setAmountToSend(1);
    setAddressInputError('');
  };

  if (!shouldShowEoa) {
    return (
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Transfer ERC-20 Token: Fee Proxy</h3>
            </CodeView>
          </div>
          <div className="row">
            Fee Proxy can only sent from an EOA on The Root Network
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Transfer ERC-20 Token: Fee Proxy</h3>
              <h4>
                Current Chain: <CurrentChainSwap />
              </h4>
              {userSession?.eoa && (
                <div>Sending from {shortAddress(userSession?.eoa)}</div>
              )}
            </CodeView>
          </div>
          <div className="row">
            <label>
              Asset ID
              <input
                type="number"
                value={assetId}
                min={1}
                className="w-full builder-input"
                onChange={e => {
                  setAssetId(Number(e.target.value));
                  setAssetContract(
                    assetIdToERC20Address(
                      Number(e.target.value)
                    ) as \`0x$\{string}\`
                  );
                }}
              />
            </label>
            <label>
              Asset Contract
              <input
                value={assetContract}
                className="w-full builder-input"
                onChange={e => {
                  setAssetId(
                    erc20AddressToAssetId(e.target.value as \`0x$\{string}\`)
                  );
                  setAssetContract(e.target.value as \`0x$\{string}\`);
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
            {(userBalance as bigint) && (
              <div style={{ display: 'inline-block', fontSize: '0.8rem' }}>
                Balance:{' '}
                {formatUnits(userBalance as bigint, decimals as number)}
              </div>
            )}
          </div>
          <div className="row">
            <AddressToSend
              addressToSend={addressToSend}
              setAddressToSend={setAddressToSend}
              addressInputError={addressInputError}
              setAddressInputError={setAddressInputError}
            />
          </div>
          <div className="row">
            <label>
              Amount
              <input
                type="number"
                value={amountToSend}
                min={1}
                className="w-full builder-input"
                onChange={e => setAmountToSend(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="row">
            <label>
              Gas Token
              <select
                value={feeAssetId}
                className="w-full builder-input"
                onChange={e => {
                  setFeeAssetId(Number(e.target.value));
                  resetState();
                }}
              >
                <option value={ASSET_ID.ROOT}>ROOT</option>
                <option value={ASSET_ID.SYLO}>SYLO</option>
                <option value={ASSET_ID.ASTO}>ASTO</option>
              </select>
            </label>
          </div>

          <div className="row">
            <SliderInput
              sliderValue={slippage}
              setSliderValue={setSlippage}
              minValue={0}
              sliderStep={0.1}
              maxValue={15}
              onChangeEvent={() => resetState()}
            />
          </div>

          <div className="row">
            <button
              className={\`w-full builder-input green $\{
                buttonDisabled ? 'disabled' : ''
              }\`}
              onClick={async () => {
                setShowDialog(true);
              }}
              disabled={buttonDisabled}
            >
              Start Fee Proxy Transfer
            </button>
          </div>
        </div>
      </div>
      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={fromWallet}
          contract={contractDebounced}
          functionName="transfer"
          abi={parseAbi(ERC20_PRECOMPILE_ABI)}
          args={[
            addressToSend,
            parseUnits(amountToSend.toString(), decimals as number),
          ]}
          feeAssetId={feeAssetId}
          slippage={slippage}
          callback={() => {
            resetState();
            // setShowDialog(false);
          }}
          decimals={decimals as number}
        />
      )}
    </>
  );
}
`;

export default function FeeProxyErc20Transfer() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const fromWallet = 'eoa';

  const [assetId, setAssetId] = useState(1);
  const [assetContract, setAssetContract] = useState<`0x${string}`>(
    '0xcCcCCccC00000001000000000000000000000000'
  );
  const contractDebounced = useDebounce(assetContract ?? '', 500);
  const [feeAssetId, setFeeAssetId] = useState(1);
  const [amountToSend, setAmountToSend] = useState(1);
  const [addressToSend, setAddressToSend] = useState<string>(
    (fromWallet === 'eoa'
      ? userSession?.futurepass
      : shouldShowEoa
      ? userSession?.eoa
      : '') ?? ''
  );
  const [slippage, setSlippage] = useState('5');
  const [addressInputError, setAddressInputError] = useState('');

  const { data: decimals } = useEvmGetDecimals(contractDebounced);
  const { data: userBalance, isFetching } = useEvmGetBalance(
    contractDebounced,
    fromWallet
  );

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(
    () =>
      addressInputError !== '' ||
      addressToSend === '' ||
      amountToSend <= 0 ||
      !userBalance ||
      Number(formatUnits(userBalance as bigint, decimals as number)) <=
        amountToSend ||
      isFetching ||
      !decimals ||
      !assetContract ||
      !contractDebounced,
    [
      addressInputError,
      addressToSend,
      amountToSend,
      userBalance,
      isFetching,
      decimals,
      assetContract,
      contractDebounced,
    ]
  );

  const resetState = () => {
    setAmountToSend(1);
    setAddressInputError('');
  };

  if (!shouldShowEoa) {
    return (
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Transfer ERC-20 Token: Fee Proxy</h3>
            </CodeView>
          </div>
          <div className="row">
            Fee Proxy can only sent from an EOA on The Root Network
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Transfer ERC-20 Token: Fee Proxy</h3>
              <h4>
                Current Chain: <CurrentChainSwap />
              </h4>
              {userSession?.eoa && (
                <div>Sending from {shortAddress(userSession?.eoa)}</div>
              )}
            </CodeView>
          </div>
          <div className="row">
            <label>
              Asset ID
              <input
                type="number"
                value={assetId}
                min={1}
                className="w-full builder-input"
                onChange={e => {
                  setAssetId(Number(e.target.value));
                  setAssetContract(
                    assetIdToERC20Address(
                      Number(e.target.value)
                    ) as `0x${string}`
                  );
                }}
              />
            </label>
            <label>
              Asset Contract
              <input
                value={assetContract}
                className="w-full builder-input"
                onChange={e => {
                  setAssetId(
                    erc20AddressToAssetId(e.target.value as `0x${string}`)
                  );
                  setAssetContract(e.target.value as `0x${string}`);
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
            {(userBalance as bigint) && (
              <div style={{ display: 'inline-block', fontSize: '0.8rem' }}>
                Balance:{' '}
                {formatUnits(userBalance as bigint, decimals as number)}
              </div>
            )}
          </div>
          <div className="row">
            <AddressToSend
              addressToSend={addressToSend}
              setAddressToSend={setAddressToSend}
              addressInputError={addressInputError}
              setAddressInputError={setAddressInputError}
            />
          </div>
          <div className="row">
            <label>
              Amount
              <input
                type="number"
                value={amountToSend}
                min={1}
                className="w-full builder-input"
                onChange={e => setAmountToSend(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="row">
            <label>
              Gas Token
              <select
                value={feeAssetId}
                className="w-full builder-input"
                onChange={e => {
                  setFeeAssetId(Number(e.target.value));
                  resetState();
                }}
              >
                <option value={ASSET_ID.ROOT}>ROOT</option>
                <option value={ASSET_ID.SYLO}>SYLO</option>
                <option value={ASSET_ID.ASTO}>ASTO</option>
              </select>
            </label>
          </div>

          <div className="row">
            <SliderInput
              sliderValue={slippage}
              setSliderValue={setSlippage}
              minValue={0}
              sliderStep={0.1}
              maxValue={15}
              onChangeEvent={() => resetState()}
            />
          </div>

          <div className="row">
            <button
              className={`w-full builder-input green ${
                buttonDisabled ? 'disabled' : ''
              }`}
              onClick={async () => {
                setShowDialog(true);
              }}
              disabled={buttonDisabled}
            >
              Start Fee Proxy Transfer
            </button>
          </div>
        </div>
      </div>
      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={fromWallet}
          contract={contractDebounced}
          functionName="transfer"
          abi={parseAbi(ERC20_PRECOMPILE_ABI)}
          args={[
            addressToSend,
            parseUnits(amountToSend.toString(), decimals as number),
          ]}
          feeAssetId={feeAssetId}
          slippage={slippage}
          callback={() => {
            resetState();
            // setShowDialog(false);
          }}
          decimals={decimals as number}
        />
      )}
    </>
  );
}
