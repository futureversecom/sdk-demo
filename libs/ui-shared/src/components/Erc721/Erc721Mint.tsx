'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import {
  useDebounce,
  useEvmCollectionInfo,
  useShouldShowEoa,
} from '../../hooks';
import { ASSET_ID, erc20AddressToAssetId } from '../../lib/utils';
import { parseAbi } from 'viem';
import {
  collectionIdToERC721Address,
  ERC721_PRECOMPILE_ABI,
} from '@therootnetwork/evm';

import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';
import { CurrentChainSwap } from '../CurrentChainSwap';
import { EvmModal } from '../EvmModal';
import { EvmCollectionInfo } from '../EvmCollectionInfo';

const codeString = `
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import {
  useDebounce,
  useEvmCollectionInfo,
  useShouldShowEoa,
} from '../../hooks';
import { ASSET_ID, erc20AddressToAssetId } from '../../lib/utils';
import { parseAbi } from 'viem';
import {
  collectionIdToERC721Address,
  ERC721_PRECOMPILE_ABI,
} from '@therootnetwork/evm';

import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import SendFrom from '../SendFrom';
import SliderInput from '../SliderInput';
import { CurrentChainSwap } from '../CurrentChainSwap';
import { EvmModal } from '../EvmModal';
import { EvmCollectionInfo } from '../EvmCollectionInfo';


export default function Erc721Mint() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );
  const [feeAssetIdDisabled, setFeeAssetIdDisabled] = useState(false);

  const [collectionId, setCollectionId] = useState(709732);

  const [collectionContract, setCollectionContract] = useState<\`0x$\{string}\`>(
    '0xAaAAAaAa000ad464000000000000000000000000'
  );

  const contractDebounced = useDebounce(collectionContract ?? '', 500);

  const { data: collectionInfo, isFetching } =
    useEvmCollectionInfo(contractDebounced);

  const [qty, setQty] = useState(1);

  const [addressToMint, setAddressToMint] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const [feeAssetId, setFeeAssetId] = useState(2);

  const [slippage, setSlippage] = useState('5');
  const [addressInputError, setAddressInputError] = useState('');

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(() => {
    return (
      addressInputError !== '' ||
      addressToMint === '' ||
      qty <= 0 ||
      qty > 1000 ||
      !contractDebounced ||
      isFetching ||
      (!isFetching && !collectionInfo)
    );
  }, [
    addressInputError,
    addressToMint,
    qty,
    contractDebounced,
    isFetching,
    collectionInfo,
  ]);

  useEffect(() => {
    if (fromWallet === 'fpass') {
      setFeeAssetId(2);
      setFeeAssetIdDisabled(true);
    } else {
      setFeeAssetIdDisabled(false);
    }
  }, [fromWallet]);

  const resetState = () => {
    setQty(1);
    setAddressInputError('');
  };

  return (
    <>
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Mint ERC-721 Token</h3>
              <h4>
                Current Chain: <CurrentChainSwap />
              </h4>
            </CodeView>
          </div>
          <div className="row">
            <SendFrom
              label="Transfer From"
              shouldShowEoa={shouldShowEoa}
              setFromWallet={setFromWallet}
              fromWallet={fromWallet}
              setAddressToSend={setAddressToMint}
              onChangeEvent={() => resetState()}
            />
          </div>
          <div className="row">
            <label>
              Asset ID
              <input
                type="number"
                value={collectionId}
                min={1}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(Number(e.target.value));
                  setCollectionContract(
                    collectionIdToERC721Address(
                      Number(e.target.value)
                    ) as \`0x$\{string}\`
                  );
                }}
              />
            </label>
            <label>
              Asset Contract
              <input
                value={collectionContract}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(
                    erc20AddressToAssetId(e.target.value as \`0x$\{string}\`)
                  );
                  setCollectionContract(e.target.value as \`0x$\{string}\`);
                }}
              />
            </label>
            <EvmCollectionInfo
              collectionInfo={collectionInfo as string}
              isFetching={isFetching as boolean}
            />
          </div>
          <div className="row">
            <AddressToSend
              addressToSend={addressToMint}
              setAddressToSend={setAddressToMint}
              addressInputError={addressInputError}
              setAddressInputError={setAddressInputError}
              label="Address to Mint"
            />
          </div>
          <div className="row">
            <label>
              Quantity
              <input
                type="number"
                value={qty}
                min={1}
                max={1000}
                className="w-full builder-input"
                onChange={e => {
                  if (parseInt(e.target.value) <= 1000) {
                    setQty(Number(e.target.value));
                  }
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
                onChange={e => {
                  setFeeAssetId(Number(e.target.value));
                  resetState();
                }}
                disabled={feeAssetIdDisabled}
              >
                <option value={ASSET_ID.XRP}>XRP</option>
                <option value={ASSET_ID.ROOT}>ROOT</option>
                <option value={ASSET_ID.SYLO}>SYLO</option>
                <option value={ASSET_ID.ASTO}>ASTO</option>
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
                onChangeEvent={() => resetState()}
              />
            </div>
          )}

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
              Start Mint
            </button>
          </div>
        </div>
      </div>
      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={fromWallet}
          contract={contractDebounced}
          functionName="mint"
          abi={parseAbi(ERC721_PRECOMPILE_ABI)}
          args={[addressToMint, qty]}
          feeAssetId={feeAssetId}
          slippage={slippage}
          callback={() => {
            resetState();
            // setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
`;

export default function Erc721Mint() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );
  const [feeAssetIdDisabled, setFeeAssetIdDisabled] = useState(false);

  const [collectionId, setCollectionId] = useState(709732);

  const [collectionContract, setCollectionContract] = useState<`0x${string}`>(
    '0xAaAAAaAa000ad464000000000000000000000000'
  );

  const contractDebounced = useDebounce(collectionContract ?? '', 500);

  const { data: collectionInfo, isFetching } =
    useEvmCollectionInfo(contractDebounced);

  const [qty, setQty] = useState(1);

  const [addressToMint, setAddressToMint] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const [feeAssetId, setFeeAssetId] = useState(2);

  const [slippage, setSlippage] = useState('5');
  const [addressInputError, setAddressInputError] = useState('');

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(() => {
    return (
      addressInputError !== '' ||
      addressToMint === '' ||
      qty <= 0 ||
      qty > 1000 ||
      !contractDebounced ||
      isFetching ||
      (!isFetching && !collectionInfo)
    );
  }, [
    addressInputError,
    addressToMint,
    qty,
    contractDebounced,
    isFetching,
    collectionInfo,
  ]);

  useEffect(() => {
    if (fromWallet === 'fpass') {
      setFeeAssetId(2);
      setFeeAssetIdDisabled(true);
    } else {
      setFeeAssetIdDisabled(false);
    }
  }, [fromWallet]);

  const resetState = () => {
    setQty(1);
    setAddressInputError('');
  };

  return (
    <>
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Mint ERC-721 Token</h3>
              <h4>
                Current Chain: <CurrentChainSwap />
              </h4>
            </CodeView>
          </div>
          <div className="row">
            <SendFrom
              label="Transfer From"
              shouldShowEoa={shouldShowEoa}
              setFromWallet={setFromWallet}
              fromWallet={fromWallet}
              setAddressToSend={setAddressToMint}
              onChangeEvent={() => resetState()}
            />
          </div>
          <div className="row">
            <label>
              Asset ID
              <input
                type="number"
                value={collectionId}
                min={1}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(Number(e.target.value));
                  setCollectionContract(
                    collectionIdToERC721Address(
                      Number(e.target.value)
                    ) as `0x${string}`
                  );
                }}
              />
            </label>
            <label>
              Asset Contract
              <input
                value={collectionContract}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(
                    erc20AddressToAssetId(e.target.value as `0x${string}`)
                  );
                  setCollectionContract(e.target.value as `0x${string}`);
                }}
              />
            </label>
            <EvmCollectionInfo
              collectionInfo={collectionInfo as string}
              isFetching={isFetching as boolean}
            />
          </div>
          <div className="row">
            <AddressToSend
              addressToSend={addressToMint}
              setAddressToSend={setAddressToMint}
              addressInputError={addressInputError}
              setAddressInputError={setAddressInputError}
              label="Address to Mint"
            />
          </div>
          <div className="row">
            <label>
              Quantity
              <input
                type="number"
                value={qty}
                min={1}
                max={1000}
                className="w-full builder-input"
                onChange={e => {
                  if (parseInt(e.target.value) <= 1000) {
                    setQty(Number(e.target.value));
                  }
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
                onChange={e => {
                  setFeeAssetId(Number(e.target.value));
                  resetState();
                }}
                disabled={feeAssetIdDisabled}
              >
                <option value={ASSET_ID.XRP}>XRP</option>
                <option value={ASSET_ID.ROOT}>ROOT</option>
                <option value={ASSET_ID.SYLO}>SYLO</option>
                <option value={ASSET_ID.ASTO}>ASTO</option>
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
                onChangeEvent={() => resetState()}
              />
            </div>
          )}

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
              Start Mint
            </button>
          </div>
        </div>
      </div>
      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={fromWallet}
          contract={contractDebounced}
          functionName="mint"
          abi={parseAbi(ERC721_PRECOMPILE_ABI)}
          args={[addressToMint, qty]}
          feeAssetId={feeAssetId}
          slippage={slippage}
          callback={() => {
            resetState();
            // setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
