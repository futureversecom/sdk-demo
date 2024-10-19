import { useMemo, useState } from 'react';
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

  const [collectionId, setCollectionId] = useState(292964);
  const [collectionContract, setCollectionContract] = useState<`0x${string}`>(
    '0xBBBBbBBb00047864000000000000000000000000'
  );

  const contractDebounced = useDebounce(collectionContract ?? '', 500);

  const [qty, setQty] = useState(1);
  const [addressToMint, setAddressToMint] = useState<string>(
    (fromWallet === 'eoa'
      ? userSession?.futurepass
      : shouldShowEoa
      ? userSession?.eoa
      : '') ?? ''
  );

  const [addressInputError, setAddressInputError] = useState('');

  const { data: collectionOwner, isFetching } =
    useEvmCollectionInfoSft(contractDebounced);

  console.log('collectionOwner', collectionOwner);

  const [showDialog, setShowDialog] = useState(false);

  const buttonDisabled = useMemo(() => {
    return (
      addressInputError !== '' ||
      addressToMint === '' ||
      qty <= 0 ||
      qty > 1000 ||
      !contractDebounced ||
      isFetching ||
      (!isFetching && !collectionOwner)
    );
  }, [
    addressInputError,
    addressToMint,
    qty,
    contractDebounced,
    isFetching,
    collectionOwner,
  ]);

  const resetState = () => {
    setQty(1);
    setAddressInputError('');
  };

  if (!shouldShowEoa) {
    return (
      <div className="card">
        <div className="inner">
          <div className="row">
            <CodeView code={codeString}>
              <h3>Mint ERC-1155 Token: EOA</h3>
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
              <h3>Mint ERC-1155 Token: EOA</h3>
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
            <button
              className={`w-full builder-input green ${
                buttonDisabled ? 'disabled' : ''
              }`}
              onClick={async () => {
                setShowDialog(true);
              }}
              disabled={buttonDisabled}
            >
              Start EOA Mint
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
          args={[addressToMint, qty]}
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
