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

const codeString = ``;

export default function EoaErc1155Mint() {
  const { userSession } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  const fromWallet = 'eoa';

  const [collectionId, setCollectionId] = useState(834660);
  const [collectionContract, setCollectionContract] = useState<`0x${string}`>(
    '0xbbbBBbbb000CBc64000000000000000000000000'
  );

  const contractDebounced = useDebounce(collectionContract ?? '', 500);

  const [tokenQty, setTokenQty] = useState<Array<[number, number]>>([[0, 1]]);

  const [addressToMint, setAddressToMint] = useState<string>(
    (fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass) ?? ''
  );

  const [addressInputError, setAddressInputError] = useState('');

  const { data: collectionOwner, isFetching } =
    useEvmCollectionInfoSft(contractDebounced);

  console.log('collectionOwner', collectionOwner);

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(() => {
    const anyTokenQtyBiggerThan1000 = tokenQty.some(t => t[1] > 1000);
    const anyTokenQtySmallerThan1 = tokenQty.some(t => t[1] < 1);

    return (
      addressInputError !== '' ||
      addressToMint === '' ||
      tokenQty?.length === 0 ||
      anyTokenQtyBiggerThan1000 ||
      anyTokenQtySmallerThan1 ||
      !contractDebounced ||
      isFetching ||
      (!isFetching && !collectionOwner)
    );
  }, [
    addressInputError,
    addressToMint,
    tokenQty,
    contractDebounced,
    isFetching,
    collectionOwner,
  ]);

  const resetState = () => {
    setTokenQty([[0, 1]]);
    setAddressInputError('');
  };

  if (!shouldShowEoa) {
    return (
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Batch Mint ERC-1155 Token: EOA</h3>
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
              <h3>Batch Mint ERC-1155 Token: EOA</h3>
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
          {tokenQty.map((token, index) => (
            <div
              className="row"
              style={{
                display: 'grid',
                gap: '8px',
                gridTemplateColumns: '3fr 3fr 1fr',
                marginTop: '8px',
              }}
              key={index}
            >
              <label>
                Token ID
                <input
                  type="number"
                  value={token[0]}
                  min={0}
                  className="w-full builder-input"
                  style={{ marginTop: '4px' }}
                  onChange={e => {
                    setTokenQty([
                      ...tokenQty.slice(0, index),
                      [Number(e.target.value), token[1]],
                      ...tokenQty.slice(index + 1),
                    ]);
                  }}
                />
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  value={token[1]}
                  min={1}
                  max={1000}
                  className="w-full builder-input"
                  style={{ marginTop: '4px' }}
                  onChange={e => {
                    if (parseInt(e.target.value) <= 1000) {
                      setTokenQty([
                        ...tokenQty.slice(0, index),
                        [token[0], Number(e.target.value)],
                        ...tokenQty.slice(index + 1),
                      ]);
                    }
                  }}
                />
              </label>
              <button
                style={{ top: '6px', position: 'relative', cursor: 'pointer' }}
                className="w-full builder-input green"
                onClick={() => {
                  setTokenQty([
                    ...tokenQty.slice(0, index),
                    ...tokenQty.slice(index + 1),
                  ]);
                }}
              >
                -
              </button>
            </div>
          ))}
          <div className="row">
            <button
              style={{ marginTop: '8px', cursor: 'pointer' }}
              className="w-full builder-input green"
              onClick={() => {
                setTokenQty([...tokenQty, [0, 1]]);
              }}
            >
              +
            </button>
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
              Start EOA Batch Mint
            </button>
          </div>
        </div>
      </div>

      {showDialog && (
        <EvmModal
          setShowDialog={setShowDialog}
          fromWallet={'eoa'}
          contract={contractDebounced}
          functionName="mintBatch"
          abi={parseAbi(ERC1155_PRECOMPILE_ABI)}
          args={[
            addressToMint,
            tokenQty.map(t => t[0]),
            tokenQty.map(t => t[1]),
          ]}
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