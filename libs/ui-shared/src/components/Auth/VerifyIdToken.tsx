'use client';
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useMutation } from '@tanstack/react-query';
import CodeView from '../CodeView';
import Spinner from '../Spinner';
import { userApiCodeString } from '../../lib';

const codeString = `
'use client';
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useMutation } from '@tanstack/react-query';
import CodeView from '../CodeView';
import Spinner from '../Spinner';

export function VerifyIdToken() {
  const { userSession } = useAuth();

  const {
    data: idToken,
    isPending: idTokenLoading,
    mutate: validateIdToken,
  } = useMutation({
    mutationFn: () =>
      fetch('/api/verify-id-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${userSession?.user?.access_token}\`,
        },
        body: JSON.stringify({ id_token: userSession?.user?.id_token }),
      }).then(res => res.json()),
  });

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={''} helperCode={undefined}>
            <h3>Verify Id Token</h3>
          </CodeView>
        </div>

        <div className="row">
          <button className="green no-margin" onClick={() => validateIdToken()}>
            Verify Id Token & User
          </button>
        </div>
        {idTokenLoading ? (
          <div className="row">
            <div className="flex-row">
              <Spinner /> Verifying Id Token on Server...
            </div>
          </div>
        ) : idToken ? (
          <div className="row">
            <pre className="">{JSON.stringify(idToken, null, 2)}</pre>
          </div>
        ) : null}
        {idToken && (
          <div className="row">
            The Pass returned from the server
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {idToken.user.futurepass === userSession?.futurepass
                ? ' matches '
                : ' does not match '}
            </span>
            the users Pass
          </div>
        )}
      </div>
    </div>
  );
}
`;

export function VerifyIdToken() {
  const { userSession } = useAuth();

  const {
    data: idToken,
    isPending: idTokenLoading,
    mutate: validateIdToken,
  } = useMutation({
    mutationFn: () =>
      fetch('/api/verify-id-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession?.user?.access_token}`,
        },
        body: JSON.stringify({ id_token: userSession?.user?.id_token }),
      }).then(res => res.json()),
  });

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={userApiCodeString}>
            <h3>Verify Id Token</h3>
          </CodeView>
        </div>

        <div className="row">
          <button className="green no-margin" onClick={() => validateIdToken()}>
            Verify Id Token & User
          </button>
        </div>
        {idTokenLoading ? (
          <div className="row">
            <div className="flex-row">
              <Spinner /> Verifying Id Token on Server...
            </div>
          </div>
        ) : idToken ? (
          <div className="row">
            <pre className="">{JSON.stringify(idToken, null, 2)}</pre>
          </div>
        ) : null}
        {idToken && (
          <div className="row">
            The Pass returned from the server
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {idToken.user.futurepass === userSession?.futurepass
                ? ' matches '
                : ' does not match '}
            </span>
            the users Pass
          </div>
        )}
      </div>
    </div>
  );
}
