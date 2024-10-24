'use client';

import React, { useEffect, useState } from 'react';
import CodeView from './CodeView';
import { useSignMessage } from 'wagmi';
import { useFutureverseSigner } from '@futureverse/auth-react';

const codeString = `
'use client';

import React, { useEffect, useState } from 'react';
import CodeView from './CodeView';
import { useSignMessage } from 'wagmi';
import { useFutureverseSigner } from '@futureverse/auth-react';

export function SignerDebug() {
  const { signMessageAsync } = useSignMessage();
  const signer = useFutureverseSigner();

  const [signerVerification, setSignerVerification] = useState<string>('');
  const [signerAddress, setSignerAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      const address = await signer?.getAddress();
      setSignerAddress(address || '');
    })();
  }, [signer]);

  return (
    <div>
      <CodeView code={codeString}>
        <h2>Signer Debug</h2>
      </CodeView>
      <div className="card">
        <div className="inner">
          <div className="row content-row">
            <div className="title">Signer Address</div>
            {signerAddress && <div className="content">{signerAddress}</div>}
          </div>
          <button
            disabled={!signer}
            className="green"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const message =
                'Welcome to the Root Network Demo... Please sign this message.';

              signMessageAsync({ message }).then(async signed => {
                if (signed) {
                  console.log('Signed Message Response', signed);
                  const validate = await signer?.verifySignature(
                    message,
                    signed
                  );
                  setSignerVerification(\`$\{validate?.ethAddress}\`);
                }
              });
            }}
          >
            Sign Message
          </button>
          {!signer && <small>Signer is currently missing</small>}
          {signerVerification && (
            <div className="row content-row">
              <div className="title">Signed by</div>
              <div className="content">{signerVerification}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;

export function SignerDebug() {
  const { signMessageAsync } = useSignMessage();
  const signer = useFutureverseSigner();

  const [signerVerification, setSignerVerification] = useState<string>('');
  const [signerAddress, setSignerAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      const address = await signer?.getAddress();
      setSignerAddress(address || '');
    })();
  }, [signer]);

  return (
    <div>
      <CodeView code={codeString}>
        <h2>Signer Debug</h2>
      </CodeView>
      <div className="card">
        <div className="inner">
          <div className="row content-row">
            <div className="title">Signer Address</div>
            {signerAddress && <div className="content">{signerAddress}</div>}
          </div>
          <button
            disabled={!signer}
            className="green"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const message =
                'Welcome to the Root Network Demo... Please sign this message.';

              signMessageAsync({ message }).then(async signed => {
                if (signed) {
                  console.log('Signed Message Response', signed);
                  const validate = await signer?.verifySignature(
                    message,
                    signed
                  );
                  setSignerVerification(`${validate?.ethAddress}`);
                }
              });
            }}
          >
            Sign Message
          </button>
          {!signer && <small>Signer is currently missing</small>}
          {signerVerification && (
            <div className="row content-row">
              <div className="title">Signed by</div>
              <div className="content">{signerVerification}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
