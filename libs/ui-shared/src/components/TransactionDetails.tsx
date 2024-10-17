import { useMemo, useState } from 'react';
import { ExtrinsicResult } from '@futureverse/transact';

import { useCallback } from 'react';
import { useRootStore } from '../hooks/useRootStore';
import { formatUnits } from 'viem';
import { Dialog } from './Dialog/Dialog';
import CodeView from './CodeView';

const codeString = `
import React, { useMemo, useState } from 'react';
import { ExtrinsicResult } from '@futureverse/transact';

import { useCallback } from 'react';
import { useRootStore } from '../hooks/useRootStore';
import { formatUnits } from 'viem';
import { Dialog } from './Dialog/Dialog';

export default function TransactionDetails() {
  const [showDialog, setShowDialog] = useState(true);

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

  const showClose = useMemo(() => {
    if ((signed || sent) && !result && !error) {
      return false;
    }
    return true;
  }, [signed, sent, result, error]);

  return (
    gas &&
    showDialog && (
      <Dialog>
        <Dialog.Container>
          <Dialog.Content>
            <div className="card">
              <div className="inner">
                {showClose && (
                  <button
                    className="dialog-close green"
                    onClick={() => setShowDialog(false)}
                  >
                    X
                  </button>
                )}
                {!result && !error && !signed && (
                  <>
                    <h2>Transaction Details</h2>
                    <div className="grid cols-1  gap-0 mb-8">
                      <div className="w-full small">Gas Details</div>
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
                        <div className="w-full small">Message To Sign</div>
                        <span className="pre">{toSign}</span>
                      </div>
                    )}
                    {payload && (
                      <>
                        <div className="grid cols-1 gap-0">
                          <div className="small">TRN Message</div>
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

                    {sent && <div>Extrinsic Sent</div>}
                  </>
                )}
                {signed && !result && !error && (
                  <div className="grid cols-1">
                    <div
                      className="spinner"
                      style={{
                        margin: '0 auto',
                        marginTop: '16px',
                        width: '100px',
                        height: '100px',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      Waiting for transaction to finalise...
                    </div>
                  </div>
                )}
                {result && (
                  <>
                    <h2>Transaction Result</h2>
                    <div className="grid cols-1">
                      <pre>{JSON.stringify(result, null, 2)}</pre>

                      <a
                        href={\`https://porcini.rootscan.io/extrinsic/{result.extrinsicId}\`}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ textDecoration: 'underline' }}
                      >
                        View Extrinsic on Explorer ({result.extrinsicId})
                      </a>
                      <button
                        className="builder-input green"
                        onClick={() => setShowDialog(false)}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
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
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Container>
      </Dialog>
    )
  );
}
`;

export default function TransactionDetails() {
  const [showDialog, setShowDialog] = useState(true);

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
    signedCallback,
  } = useRootStore(state => state);

  const onSign = useCallback(() => {
    setSigned(true);
    signedCallback && signedCallback();
    console.log('Signed');
  }, [setSigned, signedCallback]);

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

  const showClose = useMemo(() => {
    if ((signed || sent) && !result && !error) {
      return false;
    }
    return true;
  }, [signed, sent, result, error]);

  return (
    gas &&
    showDialog && (
      <Dialog>
        <Dialog.Container>
          <Dialog.Content>
            <div className="card">
              <div className="inner">
                {showClose && (
                  <button
                    className="dialog-close green"
                    onClick={() => setShowDialog(false)}
                  >
                    X
                  </button>
                )}
                {!result && !error && !signed && (
                  <>
                    <CodeView code={codeString}>
                      <h2>Transaction Details</h2>
                    </CodeView>

                    <div className="grid cols-1  gap-0 mb-8">
                      <div className="w-full small">Gas Details</div>
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
                        <div className="w-full small">Message To Sign</div>
                        <span className="pre">{toSign}</span>
                      </div>
                    )}
                    {payload && (
                      <>
                        <div className="grid cols-1 gap-0">
                          <div className="small">TRN Message</div>
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

                    {sent && <div>Extrinsic Sent</div>}
                  </>
                )}
                {signed && !result && !error && (
                  <div className="grid cols-1">
                    <div
                      className="spinner"
                      style={{
                        margin: '0 auto',
                        marginTop: '16px',
                        width: '100px',
                        height: '100px',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      Waiting for transaction to finalise...
                    </div>
                  </div>
                )}
                {result && (
                  <>
                    <CodeView code={codeString}>
                      <h2>Transaction Result</h2>
                    </CodeView>
                    <div className="grid cols-1">
                      <pre>{JSON.stringify(result, null, 2)}</pre>

                      <a
                        href={`https://porcini.rootscan.io/extrinsic/${result.extrinsicId}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ textDecoration: 'underline' }}
                      >
                        View Extrinsic on Explorer ({result.extrinsicId})
                      </a>
                      <button
                        className="builder-input green"
                        onClick={() => setShowDialog(false)}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
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
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Container>
      </Dialog>
    )
  );
}
