import { DarkTheme, ThemeConfig, useAuthUi } from '@futureverse/auth-ui';
import CodeView from '../CodeView';
import { authProvidersCodeString } from '../../lib';

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

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online Sign In UI: Hide Some</h3>
            <div>Hiding MetaMask, Coinbase, WalletConnect, X & Discord</div>
          </CodeView>
          <button
            onClick={() => {
              setTheme({
                ...DarkTheme,
                hideConnectors: [
                  'metaMaskSDK',
                  'coinbaseWalletSDK',
                  'walletConnect',
                  'x',
                  'facebook',
                  'discord',
                ],
                defaultAuthOption: 'web3',
              });
              openLogin();
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
