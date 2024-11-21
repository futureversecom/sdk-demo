'use client';

import { DefaultTheme, ThemeConfig, useAuthUi } from '@futureverse/auth-ui';
import React, { useEffect } from 'react';
import CodeView from '../CodeView';
import {
  authProvidersCodeString,
  buttonDisable,
  disableAuthLoginButtons,
} from '../../lib';

const codeString = `
import { DefaultTheme, ThemeConfig, useAuthUi } from '@futureverse/auth-ui';
import React, { useEffect } from 'react';
import CodeView from '../CodeView';
import {
  authProvidersCodeString,
  buttonDisable,
  disableAuthLoginButtons,
} from '../../lib';



export function AuthCustodialFirst({
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
            <h3>Pass.Online Sign In UI: Custodial First</h3>
          </CodeView>
          <button
            onClick={() => {
              setTheme({
                ...DefaultTheme,
                defaultAuthOption: 'custodial',
              });
              openLogin();
              disableAuthLoginButtons();
            }}
            className="green no-margin"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export function AuthCustodialFirst({
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
            <h3>Pass.Online Sign In UI: Custodial First</h3>
          </CodeView>
          <button
            onClick={() => {
              setTheme({
                ...DefaultTheme,
                defaultAuthOption: 'custodial',
              });
              openLogin();
              disableAuthLoginButtons();
            }}
            className="green no-margin"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
