'use client';

import React from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';
import CodeView from './CodeView';
import { CurrentChainSwap } from './CurrentChainSwap';

const codeString = `
import React from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';
import CodeView from './CodeView';
import { CurrentChainSwap } from './CurrentChainSwap';

export function ConnectorInfo() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();

  return (
    <div className="">
      <CodeView code={codeString}>
        <h2>Connector Info</h2>
      </CodeView>
      <div className="card">
        <div className="inner" style={{ gridColumn: 'span 2' }}>
          <div className="grid cols-2">
            <div className="row content-row">
              <div className="title">Connector</div>
              <div className="content">{connector?.name}</div>
            </div>
            <div className="row content-row">
              <div className="title">Authentication Method</div>
              <div className="content">{authMethod}</div>
            </div>
          </div>
          <div className="grid cols-2">
            <div className="row content-row">
              <div className="title">User Chain ID</div>
              <div className="content">{userSession?.chainId}</div>
            </div>
            <div className="row content-row">
              <div className="title">Wagmi Chain ID</div>
              <div className="content">
                <CurrentChainSwap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

`;

export function ConnectorInfo() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();

  return (
    <div className="">
      <CodeView code={codeString}>
        <h2>Connector Info</h2>
      </CodeView>
      <div className="card">
        <div className="inner" style={{ gridColumn: 'span 2' }}>
          <div className="grid cols-2">
            <div className="row content-row">
              <div className="title">Connector</div>
              <div className="content">{connector?.name}</div>
            </div>
            <div className="row content-row">
              <div className="title">Authentication Method</div>
              <div className="content">{authMethod}</div>
            </div>
          </div>
          <div className="grid cols-2">
            <div className="row content-row">
              <div className="title">User Chain ID</div>
              <div className="content">{userSession?.chainId}</div>
            </div>
            <div className="row content-row">
              <div className="title">Wagmi Chain ID</div>
              <div className="content">
                <CurrentChainSwap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
