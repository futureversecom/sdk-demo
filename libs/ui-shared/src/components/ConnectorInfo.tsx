import React, { useCallback } from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';
import CodeView from './CodeView';
import { useChainId, useConfig } from 'wagmi';
import { switchChain } from '@wagmi/core';

const codeString = `
import React from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';
import { useChainId } from 'wagmi';
import { switchChain } from '@wagmi/core'

export function ConnectorInfo() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();
  const chainId = useChainId();

  return (
    <div className="">
      <h2>Connector Info</h2>
      <div className="card">
        <div className="inner" style={{ gridColumn: 'span 2' }}>
          <div className="row">Connector: {connector?.name}</div>
          <div className="row">Authentication Method: {authMethod}</div>
          <div className="row">User Chain ID: {userSession?.chainId}</div>
          <div className="row">Wagmi Chain ID: {chainId}</div>
        </div>
      </div>
    </div>
  );
}
`;

export function ConnectorInfo() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();
  const chainId = useChainId();
  const config = useConfig();

  const switchToChain = useCallback(async () => {
    if (!userSession?.chainId) return;
    await switchChain(config, { chainId: userSession?.chainId });
  }, [config, userSession?.chainId]);

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
                {chainId}{' '}
                {chainId !== userSession?.chainId && (
                  <div
                    className="text-link"
                    onClick={async () => await switchToChain()}
                  >
                    Switch To Porcini
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
