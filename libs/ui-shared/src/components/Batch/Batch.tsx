'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { TransactionBuilder } from '@futureverse/transact';
import { useAuth } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { useRootStore } from '../../hooks/useRootStore';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';
import SendFrom from '../SendFrom';
import { useShouldShowEoa } from '../../hooks';
import SliderInput from '../SliderInput';
import { shortAddress } from '../../lib/utils';

const codeString = `
import React, { useCallback, useMemo, useState } from 'react';
import { TransactionBuilder } from '@futureverse/transact';
import { useAuth } from '@futureverse/auth-react';

import { useTrnApi } from '@futureverse/transact-react';

import { useRootStore } from '../../hooks/useRootStore';
import { useFutureverseSigner } from '@futureverse/auth-react';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';
import SendFrom from '../SendFrom';
import { useShouldShowEoa } from '../../hooks';
import SliderInput from '../SliderInput';
import { shortAddress } from '../../lib/utils';

export default function Batch() {
  const { userSession } = useAuth();
  const { trnApi } = useTrnApi();
  const shouldShowEoa = useShouldShowEoa();

  const preSetTransactions = useMemo(() => {
    return [
      {
        section: 'assetsExt',
        method: 'transfer',
        args: [
          '1',
          shouldShowEoa ? userSession?.eoa : userSession?.futurepass,
          '1000000',
          true,
        ],
      },
      {
        section: 'nft',
        method: 'mint',
        args: [
          709732,
          '1',
          shouldShowEoa ? userSession?.eoa : userSession?.futurepass,
        ],
      },
      {
        section: 'sft',
        method: 'mint',
        args: [
          834660,
          [[1, 1]],
          shouldShowEoa ? userSession?.eoa : userSession?.futurepass,
        ],
      },
      {
        section: 'system',
        method: 'remark',
        args: ['Hello World'],
      },
    ];
  }, [shouldShowEoa, userSession?.eoa, userSession?.futurepass]);

  const {
    resetState,
    setCurrentBuilder,
    signed,
    result,
    error,
    setSignedCallback,
  } = useRootStore(state => state);

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const signer = useFutureverseSigner();

  const getExtrinsic = useGetExtrinsic();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [transactions, setTransactions] = useState<any[]>([]);

  const [slippage, setSlippage] = useState<string>('5');

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }
    if (transactions.length === 0) {
      console.log('No transactions added');
      return;
    }

    const builder = await TransactionBuilder.batch(
      trnApi,
      signer,
      userSession.eoa
    );

    const extrinsics = transactions.map(tx => {
      return trnApi.tx[tx.section][tx.method](...tx.args);
    });

    await builder.batchAllWithExtrinsics(extrinsics);

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        await builder.addFuturePass(userSession.futurepass);
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

    const callBack = () => {
      setTransactions([]);
    };
    setSignedCallback && setSignedCallback(callBack);

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    transactions,
    fromWallet,
    setSignedCallback,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
    slippage,
  ]);

  return (
    <div className={\`card $\{disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Batch All</h3>
          </CodeView>
        </div>
        <div className="row">
          <div className="transaction-button-row">
            <button
              className="green w-100 width-full"
              style={{ width: '100%', margin: '0' }}
              onClick={() => {
                const randomIndex = Math.floor(
                  Math.random() * preSetTransactions.length
                );
                setTransactions([
                  ...transactions,
                  preSetTransactions[randomIndex],
                ]);
              }}
            >
              Add Random Extrinsic
            </button>
            {transactions.length > 0 && (
              <button
                className="green w-100 width-full"
                style={{ width: '100%', margin: '0' }}
                onClick={() => {
                  resetState();
                  const newTransactions = [...transactions];
                  newTransactions.pop();
                  setTransactions(newTransactions);
                }}
              >
                Remove Last Extrinsic
              </button>
            )}
            {transactions.length > 0 && (
              <button
                className="green w-100 width-full"
                style={{ width: '100%', margin: '0' }}
                onClick={() => {
                  resetState();
                  setTransactions([]);
                }}
              >
                Remove All Extrinsics
              </button>
            )}
          </div>
        </div>
        <div className="row">
          <div
            className={\`transactions $\{
              transactions.length === 0 ? 'no-txs' : ''
            }\`}
          >
            <div className="transactions-inner">
              {transactions.length > 0 && (
                <>
                  {transactions.map((tx, i) => (
                    <div className="tx" key={\`tx-$\{i}\`}>
                      <div className="tx-inner">
                        <div className="tx-section">
                          <div className="title">section</div>
                          <div className="data">{tx.section}</div>
                        </div>
                        <div className="tx-method">
                          <div className="title">section</div>
                          <div className="data">{tx.method}</div>
                        </div>
                        <div className="tx-args">
                          <div className="title">args</div>

                          {tx.args.map((arg: any, j: number) => (
                            <div className="tx-arg" key={\`tx-$\{i}-arg-$\{j}\`}>
                              <div className="data">
                                {arg && arg.toString().startsWith('0x')
                                  ? shortAddress(arg)
                                  : arg}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {transactions.length === 0 && (
                <div className="no-tx">No Transactions Added</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <SendFrom
            label="Send From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
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
            className={\`w-full builder-input green $\{
              disable ? 'disabled' : ''
            }\`}
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={disable}
          >
            Submit Batch
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export default function Batch() {
  const { userSession } = useAuth();
  const { trnApi } = useTrnApi();
  const shouldShowEoa = useShouldShowEoa();

  const preSetTransactions = useMemo(() => {
    return [
      {
        section: 'assetsExt',
        method: 'transfer',
        args: [
          '1',
          shouldShowEoa ? userSession?.eoa : userSession?.futurepass,
          '1000000',
          true,
        ],
      },
      {
        section: 'nft',
        method: 'mint',
        args: [
          709732,
          '1',
          shouldShowEoa ? userSession?.eoa : userSession?.futurepass,
        ],
      },
      {
        section: 'sft',
        method: 'mint',
        args: [
          834660,
          [[1, 1]],
          shouldShowEoa ? userSession?.eoa : userSession?.futurepass,
        ],
      },
      {
        section: 'system',
        method: 'remark',
        args: ['Hello World'],
      },
    ];
  }, [shouldShowEoa, userSession?.eoa, userSession?.futurepass]);

  const {
    resetState,
    setCurrentBuilder,
    signed,
    result,
    error,
    setSignedCallback,
  } = useRootStore(state => state);

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const signer = useFutureverseSigner();

  const getExtrinsic = useGetExtrinsic();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>(
    shouldShowEoa ? 'eoa' : 'fpass'
  );

  const [feeAssetId, setFeeAssetId] = useState<number>(2);

  const [transactions, setTransactions] = useState<any[]>([]);

  const [slippage, setSlippage] = useState<string>('5');

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }
    if (transactions.length === 0) {
      console.log('No transactions added');
      return;
    }

    const builder = await TransactionBuilder.batch(
      trnApi,
      signer,
      userSession.eoa
    );

    const extrinsics = transactions.map(tx => {
      return trnApi.tx[tx.section][tx.method](...tx.args);
    });

    await builder.batchAllWithExtrinsics(extrinsics);

    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        await builder.addFuturePass(userSession.futurepass);
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

    const callBack = () => {
      setTransactions([]);
    };
    setSignedCallback && setSignedCallback(callBack);

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    transactions,
    fromWallet,
    setSignedCallback,
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
            <h3>Batch All</h3>
          </CodeView>
        </div>
        <div className="row">
          <div className="transaction-button-row">
            <button
              className="green w-100 width-full"
              style={{ width: '100%', margin: '0' }}
              onClick={() => {
                const randomIndex = Math.floor(
                  Math.random() * preSetTransactions.length
                );
                setTransactions([
                  ...transactions,
                  preSetTransactions[randomIndex],
                ]);
              }}
            >
              Add Random Extrinsic
            </button>
            {transactions.length > 0 && (
              <button
                className="green w-100 width-full"
                style={{ width: '100%', margin: '0' }}
                onClick={() => {
                  resetState();
                  const newTransactions = [...transactions];
                  newTransactions.pop();
                  setTransactions(newTransactions);
                }}
              >
                Remove Last Extrinsic
              </button>
            )}
            {transactions.length > 0 && (
              <button
                className="green w-100 width-full"
                style={{ width: '100%', margin: '0' }}
                onClick={() => {
                  resetState();
                  setTransactions([]);
                }}
              >
                Remove All Extrinsics
              </button>
            )}
          </div>
        </div>
        <div className="row">
          <div
            className={`transactions ${
              transactions.length === 0 ? 'no-txs' : ''
            }`}
          >
            <div className="transactions-inner">
              {transactions.length > 0 && (
                <>
                  {transactions.map((tx, i) => (
                    <div className="tx" key={`tx-${i}`}>
                      <div className="tx-inner">
                        <div className="tx-section">
                          <div className="title">section</div>
                          <div className="data">{tx.section}</div>
                        </div>
                        <div className="tx-method">
                          <div className="title">section</div>
                          <div className="data">{tx.method}</div>
                        </div>
                        <div className="tx-args">
                          <div className="title">args</div>

                          {tx.args.map((arg: any, j: number) => (
                            <div className="tx-arg" key={`tx-${i}-arg-${j}`}>
                              <div className="data">
                                {arg && arg.toString().startsWith('0x')
                                  ? shortAddress(arg)
                                  : arg}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {transactions.length === 0 && (
                <div className="no-tx">No Transactions Added</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <SendFrom
            label="Send From"
            shouldShowEoa={shouldShowEoa}
            setFromWallet={setFromWallet}
            fromWallet={fromWallet}
            resetState={resetState}
            disable={disable}
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
              disable ? 'disabled' : ''
            }`}
            onClick={() => {
              resetState();
              createBuilder();
            }}
            disabled={disable}
          >
            Submit Batch
          </button>
        </div>
      </div>
    </div>
  );
}
