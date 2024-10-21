import { DarkTheme, ThemeConfig, useAuthUi } from '@futureverse/auth-ui';
import React from 'react';
import CodeView from '../CodeView';
import { authProvidersCodeString, disableAuthLoginButtons } from '../../lib';

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

export function AuthWeb3Only({
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
            <h3>Pass.Online Sign In UI: Web3 Only</h3>
          </CodeView>
          <button
            onClick={() => {
              setTheme({
                ...DarkTheme,
                defaultAuthOption: 'web3',
                hideCustodial: true,
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