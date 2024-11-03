'use client';
import React from 'react';
import CodeView from '../CodeView';
import { authProvidersCodeString } from '../../lib';
import { useAuth } from '@futureverse/auth-react';
import Spinner from '../Spinner';
import { useShouldShowEoa } from '../../hooks';

const codeString = `
'use client';
import React from 'react';
import CodeView from '../CodeView';
import { authProvidersCodeString } from '../../lib';
import { useAuth } from '@futureverse/auth-react';
import Spinner from '../Spinner';
import { useShouldShowEoa } from '../../hooks';

export function AuthUserSession() {
  const { isFetchingSession, userSession, authMethod } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online User Session</h3>
          </CodeView>
        </div>
        <div className="row content-row">
          <div className="title">User Session Status</div>
          <div className="content">
            {' '}
            {isFetchingSession ? (
              <div>
                <Spinner /> Loading
              </div>
            ) : (
              <div>Loaded</div>
            )}
          </div>
        </div>
        <div className="row content-row">
          <div className="title">Auth Method</div>
          <div className="content">{authMethod}</div>
        </div>
        <div className="row content-row">
          <h3>User Session</h3>
        </div>
        <div className="row content-row">
          <div className="title">Chain Id</div>
          <div className="content">{userSession?.chainId}</div>
        </div>
        <div className="row content-row">
          <div className="title">Custodial Type</div>
          <div className="content">{userSession?.custodian}</div>
        </div>
        <div className="row content-row">
          <div className="title">Should Show Eoa</div>
          <div className="content">{shouldShowEoa.toString()}</div>
        </div>
        {shouldShowEoa && (
          <div className="row content-row">
            <div className="title">Eoa</div>
            <div className="content">{userSession?.eoa}</div>
          </div>
        )}
        <div className="row content-row">
          <div className="title">FuturePass</div>
          <div className="content">{userSession?.futurepass}</div>
        </div>
        <div className="row content-row">
          <div className="title">User Profile</div>
          <div className="content">
            <pre>{JSON.stringify(userSession?.user?.profile, null, 2)}</pre>
          </div>
        </div>
        <div className="row content-row">
          <div className="title">UserSession Tokens</div>
          <div className="content">
            Don't Output Tokens...{'  '}
            <span role="img" aria-label="smiley">
              😊
            </span>
          </div>
          <div className="row">
            <div>userSession?.user?.access_token</div>
            <div>userSession?.user?.refresh_token</div>
            <div>userSession?.user?.id_token</div>
            <div>userSession?.user?.scopes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

`;

export function AuthUserSession() {
  const { isFetchingSession, userSession, authMethod } = useAuth();
  const shouldShowEoa = useShouldShowEoa();

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online User Session</h3>
          </CodeView>
        </div>
        <div className="row content-row">
          <div className="title">User Session Status</div>
          <div className="content">
            {' '}
            {isFetchingSession ? (
              <div>
                <Spinner /> Loading
              </div>
            ) : (
              <div>Loaded</div>
            )}
          </div>
        </div>
        <div className="row content-row">
          <div className="title">Auth Method</div>
          <div className="content">{authMethod}</div>
        </div>
        <div className="row content-row">
          <h3>User Session</h3>
        </div>
        <div className="row content-row">
          <div className="title">Chain Id</div>
          <div className="content">{userSession?.chainId}</div>
        </div>
        <div className="row content-row">
          <div className="title">Custodial Type</div>
          <div className="content">{userSession?.custodian}</div>
        </div>
        <div className="row content-row">
          <div className="title">Should Show Eoa</div>
          <div className="content">{shouldShowEoa.toString()}</div>
        </div>
        {shouldShowEoa && (
          <div className="row content-row">
            <div className="title">Eoa</div>
            <div className="content">{userSession?.eoa}</div>
          </div>
        )}
        <div className="row content-row">
          <div className="title">FuturePass</div>
          <div className="content">{userSession?.futurepass}</div>
        </div>
        <div className="row content-row">
          <div className="title">User Profile</div>
          <div className="content">
            <pre>{JSON.stringify(userSession?.user?.profile, null, 2)}</pre>
          </div>
        </div>
        <div className="row content-row">
          <div className="title">UserSession Tokens</div>
          <div className="content">
            Don't Output Tokens...{'  '}
            <span role="img" aria-label="smiley">
              😊
            </span>
          </div>
          <div className="row">
            <div>userSession?.user?.access_token</div>
            <div>userSession?.user?.refresh_token</div>
            <div>userSession?.user?.id_token</div>
            <div>userSession?.user?.scopes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
