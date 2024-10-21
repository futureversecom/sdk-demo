import { DarkTheme, ThemeConfig, useAuthUi } from '@futureverse/auth-ui';
import CodeView from '../CodeView';
import {
  authProvidersCodeString,
  buttonDisable,
  disableAuthLoginButtons,
} from '../../lib';
import { useEffect } from 'react';

const codeString = `
import { useAuthUi } from '@futureverse/auth-ui';
import React from 'react';
import CodeView from '../CodeView';
import { authProvidersCodeString } from '../../lib';

export function Auth() {
  const { openLogin } = useAuthUi();
  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <h3>Pass.Online Sign In UI</h3>
          <button onClick={() => openLogin()} className="green">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export function AuthHideSome({
  setTheme,
}: {
  setTheme: (theme: ThemeConfig) => void;
}) {
  const { openLogin } = useAuthUi();
  useEffect(() => {
    return () => {
      document.removeEventListener('click', buttonDisable);
    };
  }, []);
  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online Sign In UI: Hide Some</h3>
            <div>Hiding MetaMask, Coinbase, X, Facebook & Discord</div>
          </CodeView>
          <button
            onClick={() => {
              setTheme({
                ...DarkTheme,
                hideConnectors: [
                  'metaMaskSDK',
                  'coinbaseWalletSDK',
                  'x',
                  'facebook',
                  'discord',
                ],
                defaultAuthOption: 'web3',
              });
              openLogin();
              disableAuthLoginButtons();
            }}
            className="green"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
