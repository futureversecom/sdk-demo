import React from 'react';
import { ExtrinsicResult } from '@futureverse/transact';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useRootStore } from '../hooks/useRootStore';

export default function TransactionDetails() {
  const {
    gas,
    payload,
    toSign,
    setSigned,
    setSent,
    result,
    currentBuilder,
    setResult,
    signed,
    sent,
  } = useRootStore(state => state);

  const onSign = useCallback(() => {
    setSigned(true);
    console.log('Signed');
  }, [setSigned]);

  const onSend = useCallback(() => {
    setSent(true);
    console.log('Sent');
  }, [setSent]);

  const signExtrinsic = useCallback(async () => {
    console.log('currentBuilder', currentBuilder);

    if (toSign && currentBuilder) {
      const result = await currentBuilder?.signAndSend({ onSign, onSend });
      setResult(result as ExtrinsicResult);
    }
  }, [currentBuilder, onSend, onSign, setResult, toSign]);
  return (
    gas && (
      <>
        <h2>Transaction Details</h2>
        <div className="card">
          <div className="inner">
            <div className="grid cols-1  gap-0 mb-8">
              <div className="w-full">Gas Details</div>
              <div className="gas-wrap">
                <div>Gas Fee: {gas.gasFee}</div>
                <div>Gas String: {gas.gasString}</div>
                <div>Gas Token Decimals: {gas.tokenDecimals}</div>
                <div>
                  Gas Token Decimals Formatted:{' '}
                  {ethers.formatUnits(gas.gasFee, gas.tokenDecimals)}
                </div>
              </div>
            </div>
            {toSign && (
              <div className="grid cols-1  gap-0">
                <div className="w-full">Message To Sign</div>
                <pre>{toSign}</pre>
              </div>
            )}
            {payload && (
              <>
                <div className="grid cols-1  gap-0">
                  <div>TRN Message</div>

                  <pre>{JSON.stringify(payload, null, 2)}</pre>
                </div>

                {!signed && (
                  <button
                    className="builder-input green"
                    onClick={signExtrinsic}
                  >
                    Sign & Send
                  </button>
                )}
              </>
            )}
            {signed && <div>Extrinsic Has Been Signed</div>}
            {signed && !result && <div className="spinner" />}
            {sent && <div>Extrinsic Sent</div>}
          </div>
        </div>
      </>
    )
  );
}
