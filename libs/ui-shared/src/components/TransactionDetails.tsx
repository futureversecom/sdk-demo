import React from 'react';
import { ExtrinsicResult } from '@futureverse/transact';

import { useCallback } from 'react';
import { useRootStore } from '../hooks/useRootStore';
import { formatUnits } from 'viem';

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
    setError,
    error,
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
    if (toSign && currentBuilder) {
      try {
        const result = await currentBuilder.signAndSend({ onSign, onSend });
        setResult(result as ExtrinsicResult);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      }
    }
  }, [currentBuilder, onSend, onSign, setError, setResult, toSign]);
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
                  {formatUnits(BigInt(gas.gasFee), gas.tokenDecimals)}
                </div>
              </div>
            </div>
            {toSign && (
              <div className="grid cols-1  gap-0">
                <div className="w-full">Message To Sign</div>
                <span className="pre">{toSign}</span>
              </div>
            )}
            {payload && (
              <>
                <div className="grid cols-1 gap-0">
                  <div>TRN Message</div>
                  <pre className="pre">
                    {JSON.stringify(payload.trnPayload, null, 2)}
                  </pre>
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
            {signed && !result && !error && <div className="spinner" />}
            {error && (
              <div
                className="error"
                style={{
                  background: 'rgba(223, 19, 19, 0.445)',
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                <div
                  className="error-title"
                  style={{ fontWeight: '700', fontSize: '14px' }}
                >
                  There has been an error...
                </div>
                <div className="error-message" style={{ fontSize: '12px' }}>
                  {error}
                </div>
              </div>
            )}
            {sent && <div>Extrinsic Sent</div>}
          </div>
        </div>
      </>
    )
  );
}
