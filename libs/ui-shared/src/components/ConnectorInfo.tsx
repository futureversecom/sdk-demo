import React from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';
import CodeView from './CodeView';

const codeString = `
import React from 'react';
import { useAuth, useConnector } from '@futureverse/auth-react';

export function ConnectorInfo() {
  const { userSession, authMethod } = useAuth();
  const { connector } = useConnector();
  return (
    <div className="">
      <h2>Connector Info</h2>
      <div className="card">
        <div className="inner" style={{ gridColumn: 'span 2' }}>
          <div className="row">Connector: {connector?.name}</div>
          <div className="row">Authentication Method: {authMethod}</div>
          <div className="row">User Chain ID: {userSession?.chainId}</div>
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
          <div className="row">Connector: {connector?.name}</div>
          <div className="row">Authentication Method: {authMethod}</div>
          <div className="row">User Chain ID: {userSession?.chainId}</div>
        </div>
      </div>
    </div>
  );
}
