'use client';
import React from 'react';

import { authProvidersCodeString } from '../../lib';
import CodeView from '../CodeView';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';

const codeString = `
'use client';
import React from 'react';

import { authProvidersCodeString } from '../../lib';
import CodeView from '../CodeView';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';

export function AuthSigner() {
  const { userSession } = useAuth();
  const signer = useFutureverseSigner();
  const [signature, setSignature] = React.useState<string | null>(null);
  const [recoveredAddress, setRecoveredAddress] = React.useState<string | null>(
    null
  );

  const message = \`Hi, I am signing this message to prove I am signing from $\{userSession?.eoa}\`;

  const signMessage = async () => {
    if (!signer) {
      alert('No signer available');
      return;
    }
    await signer.signMessage(message).then(async signature => {
      setSignature(signature);
      const recoveredAddress = await signer.verifySignature(message, signature);
      setRecoveredAddress(recoveredAddress.ethAddress);
    });
  };

  const reset = () => {
    setSignature(null);
    setRecoveredAddress(null);
  };

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online Signer</h3>
          </CodeView>
        </div>
        <div className="row">
          <h4>Message</h4>
          <div style={{ wordBreak: 'break-all' }}>{message}</div>
        </div>
        <div className="row">
          <button
            className="green no-margin"
            onClick={async () => {
              reset();
              signMessage();
            }}
          >
            Sign Message
          </button>
        </div>
        {signature && (
          <div className="row">
            <h4>Signature</h4>
            <div style={{ wordBreak: 'break-all' }}>{signature}</div>
          </div>
        )}
        {recoveredAddress && (
          <div className="row">
            <h4>Recovered Address</h4>
            <div style={{ wordBreak: 'break-all' }}>{recoveredAddress}</div>
          </div>
        )}
        {recoveredAddress && (
          <div className="row">
            <h4>Verified</h4>
            <div style={{ wordBreak: 'break-all' }}>
              {recoveredAddress === userSession?.eoa
                ? 'Signer Matches UserSession'
                : 'Signer Does Not Match UserSession'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

`;

export function AuthSigner() {
  const { userSession } = useAuth();
  const signer = useFutureverseSigner();
  const [signature, setSignature] = React.useState<string | null>(null);
  const [recoveredAddress, setRecoveredAddress] = React.useState<string | null>(
    null
  );

  const message = `Hi, I am signing this message to prove I am signing from ${userSession?.eoa}`;

  const signMessage = async () => {
    if (!signer) {
      alert('No signer available');
      return;
    }
    await signer.signMessage(message).then(async signature => {
      setSignature(signature);
      const recoveredAddress = await signer.verifySignature(message, signature);
      setRecoveredAddress(recoveredAddress.ethAddress);
    });
  };

  const reset = () => {
    setSignature(null);
    setRecoveredAddress(null);
  };

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online Signer</h3>
          </CodeView>
        </div>
        <div className="row">
          <h4>Message</h4>
          <div style={{ wordBreak: 'break-all' }}>{message}</div>
        </div>
        <div className="row">
          <button
            className="green no-margin"
            onClick={async () => {
              reset();
              signMessage();
            }}
          >
            Sign Message
          </button>
        </div>
        {signature && (
          <div className="row">
            <h4>Signature</h4>
            <div style={{ wordBreak: 'break-all' }}>{signature}</div>
          </div>
        )}
        {recoveredAddress && (
          <div className="row">
            <h4>Recovered Address</h4>
            <div style={{ wordBreak: 'break-all' }}>{recoveredAddress}</div>
          </div>
        )}
        {recoveredAddress && (
          <div className="row">
            <h4>Verified</h4>
            <div style={{ wordBreak: 'break-all' }}>
              {recoveredAddress === userSession?.eoa
                ? 'Signer Matches UserSession'
                : 'Signer Does Not Match UserSession'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
