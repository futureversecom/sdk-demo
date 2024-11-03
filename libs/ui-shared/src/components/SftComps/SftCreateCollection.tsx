'use client';

import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { TransactionBuilder } from '@futureverse/transact';
import { useRootStore } from '../../hooks/useRootStore';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';
import SendFrom from '../SendFrom';
import { AddressInput } from '../AddressInput';
import { URLInput } from '../UrlInput';
import SliderInput from '../SliderInput';
import { useShouldShowEoa } from '../../hooks';
import { ITuple } from '@polkadot/types/types';
import { Permill } from '@polkadot/types/interfaces';
import { Vec } from '@polkadot/types';
import { SeedPrimitivesSignatureAccountId20 } from '@polkadot/types/lookup';

const codeString = `
`;

export default function NftCreateCollection() {
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

  const shouldShowEoa = useShouldShowEoa();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [collectionName, setCollectionName] = useState<string>('');
  const [metadataUri, setMetadataUri] = useState<string>('');
  const [royalties, setRoyalties] = useState<Vec<
    ITuple<[SeedPrimitivesSignatureAccountId20, Permill]>
  > | null>(null);
  const [initialIssuance, setInitialIssuance] = useState<number | null>(null);
  const [maxIssuance, setMaxIssuance] = useState<number | null>(null);
  const [tokenOwner, setTokenOwner] = useState<string | null>(null);
  const [crossChain, setCrossChain] = useState<boolean | null>(null);

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [tokenOwnerError, setTokenOwnerError] = useState<string>('');

  const [royaltyAddressInputError, setRoyaltyAddressInputError] = useState<
    string[]
  >(['']);
  const [urlInputError, setUrlInputError] = useState<string>('');

  const [slippage, setSlippage] = useState<string>('5');

  const buttonDisabled = useMemo(() => {
    const royaltyAddressErrs = royaltyAddressInputError.some(a => a !== '');
    return (
      disable ||
      urlInputError !== '' ||
      royaltyAddressErrs ||
      !collectionName ||
      !metadataUri ||
      (!!initialIssuance && initialIssuance > 0 && tokenOwnerError !== '')
    );
  }, [
    royaltyAddressInputError,
    disable,
    urlInputError,
    collectionName,
    metadataUri,
    initialIssuance,
    tokenOwnerError,
  ]);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const sft = TransactionBuilder.sft(trnApi, signer, userSession.eoa);

    sft.createCollection({
      collectionName,
      metadataUri,
      royalties,
    });

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        await sft.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await sft.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await sft.addFeeProxy({
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    getExtrinsic(sft);
    setCurrentBuilder(sft);
  }, [
    trnApi,
    signer,
    userSession,
    collectionName,
    metadataUri,
    royalties,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Create Nft Collection</h3>
        </CodeView>
        <div className="row">
          <SendFrom
            label="Create From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
          />
        </div>
        <div className="row">
          <label>
            Collection Name
            <input
              type="text"
              value={collectionName}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setCollectionName(e.target.value);
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <URLInput
            inputUrl={metadataUri}
            setInputUrl={setMetadataUri}
            urlInputError={urlInputError}
            setUrlInputError={setUrlInputError}
            disable={disable}
            resetState={resetState}
            label="Metadata URI"
          />
        </div>
        <div className="row">
          <label>
            Initial Issuance
            <input
              type="number"
              value={initialIssuance?.toString()}
              className="w-full builder-input"
              onChange={e => {
                if (
                  (e.target.value && isNaN(Number(e.target.value))) ||
                  Number(e.target.value) < 0 ||
                  Number(e.target.value) > 1000
                ) {
                  return;
                }
                resetState();
                setInitialIssuance(Number(e.target.value));
              }}
              disabled={disable}
            />
          </label>
        </div>
        {initialIssuance && initialIssuance > 0 ? (
          <div className="row">
            <AddressInput
              inputAddress={tokenOwner || ''}
              setInputAddress={setTokenOwner}
              addressInputError={tokenOwnerError}
              setAddressInputError={setTokenOwnerError}
              label="Token Owner"
              disable={disable}
              resetState={resetState}
              canBeNull={true}
            />
          </div>
        ) : null}

        <div className="row">
          <label>
            Max Issuance
            <input
              type="number"
              value={maxIssuance ? maxIssuance?.toString() : ''}
              className="w-full builder-input"
              onChange={e => {
                setMaxIssuance(e.target.value ? Number(e.target.value) : null);
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <label style={{ marginBottom: 0 }}>Royalties</label>
          {royalties &&
            royalties.map((royalty, index) => {
              console.log('royalty', royalty);
              return (
                <div
                  className="row"
                  style={{
                    display: 'grid',
                    gap: '8px',
                    gridTemplateColumns: '4fr 2fr 1fr',
                    marginTop: '8px',
                  }}
                  key={index}
                >
                  <AddressInput
                    inputAddress={royalty[0].toString()}
                    setInputAddress={(address: string) => {
                      setRoyalties([
                        ...royalties.slice(0, index),
                        [
                          address as unknown as SeedPrimitivesSignatureAccountId20,
                          royalty[1] as unknown as number,
                        ],
                        ...royalties.slice(index + 1),
                      ] as Vec<
                        ITuple<[SeedPrimitivesSignatureAccountId20, Permill]>
                      >);
                    }}
                    addressInputError={royaltyAddressInputError[index]}
                    setAddressInputError={error => {
                      setRoyaltyAddressInputError([
                        ...royaltyAddressInputError.slice(0, index),
                        error,
                        ...royaltyAddressInputError.slice(index + 1),
                      ]);
                    }}
                    label="Royalty"
                    disable={disable}
                    resetState={resetState}
                  />
                  <label>
                    Amount (Permill)
                    <input
                      type="number"
                      value={royalty[1].toString()}
                      min={0}
                      max={100}
                      className="w-full builder-input"
                      style={{ marginTop: '4px' }}
                      onChange={e => {
                        setRoyalties([
                          ...royalties.slice(0, index),
                          [
                            royalty[0] as SeedPrimitivesSignatureAccountId20,
                            Number(e.target.value),
                          ],
                          ...royalties.slice(index + 1),
                        ] as Vec<
                          ITuple<[SeedPrimitivesSignatureAccountId20, Permill]>
                        >);
                      }}
                    />
                  </label>
                  <button
                    style={{
                      top: '6px',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    className="w-full builder-input green"
                    onClick={() => {
                      setRoyalties([
                        ...royalties.slice(0, index),
                        ...royalties.slice(index + 1),
                      ] as Vec<
                        ITuple<[SeedPrimitivesSignatureAccountId20, Permill]>
                      >);
                      setRoyaltyAddressInputError([
                        ...royaltyAddressInputError.slice(0, index),
                        ...royaltyAddressInputError.slice(index + 1),
                      ]);
                    }}
                  >
                    -
                  </button>
                </div>
              );
            })}

          <div className="row">
            <button
              style={{ marginTop: '8px', cursor: 'pointer' }}
              className="w-full builder-input green"
              onClick={() => {
                setRoyalties([
                  ...(royalties || []),
                  [
                    '' as unknown as SeedPrimitivesSignatureAccountId20,
                    0 as unknown as number,
                  ],
                ] as Vec<
                  ITuple<[SeedPrimitivesSignatureAccountId20, Permill]>
                >);
              }}
            >
              +
            </button>
          </div>
        </div>

        <div className="row">
          <label>
            Cross Chain
            <select
              value={crossChain ? 'true' : 'false'}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                setCrossChain(e.target.value === 'true');
              }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        </div>
        <div className="row"></div>
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
