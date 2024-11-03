'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import {
  useDebounce,
  useEvmCollectionInfoSft,
  useShouldShowEoa,
} from '../../hooks';
import { erc20AddressToAssetId, shortAddress } from '../../lib/utils';
import { parseAbi } from 'viem';
import {
  collectionIdToERC1155Address,
  ERC1155_PRECOMPILE_ABI,
} from '@therootnetwork/evm';

import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import { CurrentChainSwap } from '../CurrentChainSwap';
import { EvmModal } from '../EvmModal';
import { EvmCollectionInfo } from '../EvmCollectionInfo';

const codeString = `
import React, { useMemo, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import {
  useDebounce,
  useEvmCollectionInfoSft,
  useShouldShowEoa,
} from '../../hooks';
import { erc20AddressToAssetId, shortAddress } from '../../lib/utils';
import { parseAbi } from 'viem';
import {
  collectionIdToERC1155Address,
  ERC1155_PRECOMPILE_ABI,
} from '@therootnetwork/evm';

import CodeView from '../CodeView';
import { AddressToSend } from '../AddressToSend';
import { CurrentChainSwap } from '../CurrentChainSwap';
import { EvmModal } from '../EvmModal';
import { EvmCollectionInfo } from '../EvmCollectionInfo';


export default function EoaErc1155MintSingle() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const fromWallet = 'eoa';

  const [collectionId, setCollectionId] = useState(834660);
  const [collectionContract, setCollectionContract] = useState<\`0x$\{string}\`>(
    '0xbbbBBbbb000CBc64000000000000000000000000'
  );

  const contractDebounced = useDebounce(collectionContract ?? '', 500);

  const [tokenId, setTokenId] = useState(0);
  const [tokenQty, setTokenQty] = useState(1);

  const [addressToMint, setAddressToMint] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const [addressInputError, setAddressInputError] = useState('');

  const { data: collectionOwner, isFetching } =
    useEvmCollectionInfoSft(contractDebounced);

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(() => {
    return (
      addressInputError !== '' ||
      addressToMint === '' ||
      tokenQty <= 0 ||
      tokenQty > 1000 ||
      tokenId < 0 ||
      !contractDebounced ||
      isFetching ||
      (!isFetching && !collectionOwner)
    );
  }, [
    addressInputError,
    addressToMint,
    tokenQty,
    tokenId,
    contractDebounced,
    isFetching,
    collectionOwner,
  ]);

  const resetState = () => {
    setTokenId(0);
    setTokenQty(1);
    setAddressInputError('');
  };

  if (!shouldShowEoa) {
    return (
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Single Mint ERC-1155 Token: EOA</h3>
            </CodeView>
          </div>
          <div className="row">Requires an EOA on The Root Network</div>
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
              <h3>Single Mint ERC-1155 Token: EOA</h3>
              <h4>
                Current Chain: <CurrentChainSwap />
              </h4>
              {userSession?.eoa && (
                <div>Minting from {shortAddress(userSession?.eoa)}</div>
              )}
            </CodeView>
          </div>
          <div className="row">
            <label>
              Collection ID
              <input
                type="number"
                value={collectionId}
                min={1}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(Number(e.target.value));
                  setCollectionContract(
                    collectionIdToERC1155Address(
                      Number(e.target.value)
                    ) as \`0x$\{string}\`
                  );
                }}
              />
            </label>
            <label>
              Collection Contract
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
              collectionOwner={collectionOwner as string}
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
          <div
            className="row"
            style={{
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: '3fr 3fr',
              marginTop: '8px',
            }}
          >
            <label>
              Token ID
              <input
                type="number"
                value={tokenId}
                min={0}
                className="w-full builder-input"
                style={{ marginTop: '4px' }}
                onChange={e => {
                  setTokenId(Number(e.target.value));
                }}
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                value={tokenQty}
                min={1}
                max={1000}
                className="w-full builder-input"
                style={{ marginTop: '4px' }}
                onChange={e => {
                  if (parseInt(e.target.value) <= 1000) {
                    setTokenQty(Number(e.target.value));
                  }
                }}
              />
            </label>
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
              Start EOA Single Mint
            </button>
          </div>
        </div>
      </div>

      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={'eoa'}
          contract={contractDebounced}
          functionName="mint"
          abi={parseAbi(ERC1155_PRECOMPILE_ABI)}
          args={[addressToMint, tokenId, tokenQty]}
          feeAssetId={2}
          slippage={'0'}
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

export default function EoaErc1155MintSingle() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const fromWallet = 'eoa';

  const [collectionId, setCollectionId] = useState(834660);
  const [collectionContract, setCollectionContract] = useState<`0x${string}`>(
    '0xbbbBBbbb000CBc64000000000000000000000000'
  );

  const contractDebounced = useDebounce(collectionContract ?? '', 500);

  const [tokenId, setTokenId] = useState(0);
  const [tokenQty, setTokenQty] = useState(1);

  const [addressToMint, setAddressToMint] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const [addressInputError, setAddressInputError] = useState('');

  const { data: collectionOwner, isFetching } =
    useEvmCollectionInfoSft(contractDebounced);

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(() => {
    return (
      addressInputError !== '' ||
      addressToMint === '' ||
      tokenQty <= 0 ||
      tokenQty > 1000 ||
      tokenId < 0 ||
      !contractDebounced ||
      isFetching ||
      (!isFetching && !collectionOwner)
    );
  }, [
    addressInputError,
    addressToMint,
    tokenQty,
    tokenId,
    contractDebounced,
    isFetching,
    collectionOwner,
  ]);

  const resetState = () => {
    setTokenId(0);
    setTokenQty(1);
    setAddressInputError('');
  };

  if (!shouldShowEoa) {
    return (
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Single Mint ERC-1155 Token: EOA</h3>
            </CodeView>
          </div>
          <div className="row">Requires an EOA on The Root Network</div>
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
              <h3>Single Mint ERC-1155 Token: EOA</h3>
              <h4>
                Current Chain: <CurrentChainSwap />
              </h4>
              {userSession?.eoa && (
                <div>Minting from {shortAddress(userSession?.eoa)}</div>
              )}
            </CodeView>
          </div>
          <div className="row">
            <label>
              Collection ID
              <input
                type="number"
                value={collectionId}
                min={1}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(Number(e.target.value));
                  setCollectionContract(
                    collectionIdToERC1155Address(
                      Number(e.target.value)
                    ) as `0x${string}`
                  );
                }}
              />
            </label>
            <label>
              Collection Contract
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
              collectionOwner={collectionOwner as string}
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
          <div
            className="row"
            style={{
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: '3fr 3fr',
              marginTop: '8px',
            }}
          >
            <label>
              Token ID
              <input
                type="number"
                value={tokenId}
                min={0}
                className="w-full builder-input"
                style={{ marginTop: '4px' }}
                onChange={e => {
                  setTokenId(Number(e.target.value));
                }}
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                value={tokenQty}
                min={1}
                max={1000}
                className="w-full builder-input"
                style={{ marginTop: '4px' }}
                onChange={e => {
                  if (parseInt(e.target.value) <= 1000) {
                    setTokenQty(Number(e.target.value));
                  }
                }}
              />
            </label>
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
              Start EOA Single Mint
            </button>
          </div>
        </div>
      </div>

      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={'eoa'}
          contract={contractDebounced}
          functionName="mint"
          abi={parseAbi(ERC1155_PRECOMPILE_ABI)}
          args={[addressToMint, tokenId, tokenQty]}
          feeAssetId={2}
          slippage={'0'}
          callback={() => {
            resetState();
            // setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
