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

export function VerifyUser() {
  const { userSession } = useAuth();

  const {
    data: user,
    isPending: userLoading,
    mutate: validateUser,
  } = useMutation({
    mutationFn: () =>
      fetch('/api/verify-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${userSession?.user?.access_token}\`,
        },
        body: JSON.stringify({ who: userSession?.futurepass }),
      }).then(res => res.json()),
  });

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={''} helperCode={undefined}>
            <h3>Verify User</h3>
          </CodeView>
        </div>

        <div className="row">
          <button className="green no-margin" onClick={() => validateUser()}>
            Verify User
          </button>
        </div>
        {userLoading ? (
          <div className="row">
            <div className="flex-row">
              <Spinner /> Verifying User on Server...
            </div>
          </div>
        ) : user ? (
          <div className="row">
            <pre className="">{JSON.stringify(user, null, 2)}</pre>
          </div>
        ) : null}
        {user && (
          <div className="row">
            The Pass returned from the server
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {user.futurepass === userSession?.futurepass
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

export function VerifyUser() {
  const { userSession } = useAuth();

  const {
    data: user,
    isPending: userLoading,
    mutate: validateUser,
  } = useMutation({
    mutationFn: () =>
      fetch('/api/verify-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession?.user?.access_token}`,
        },
        body: JSON.stringify({ who: userSession?.futurepass }),
      }).then(res => res.json()),
  });

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={userApiCodeString}>
            <h3>Verify User</h3>
          </CodeView>
        </div>

        <div className="row">
          <button className="green no-margin" onClick={() => validateUser()}>
            Verify User
          </button>
        </div>
        {userLoading ? (
          <div className="row">
            <div className="flex-row">
              <Spinner /> Verifying User on Server...
            </div>
          </div>
        ) : user ? (
          <div className="row">
            <pre className="">{JSON.stringify(user, null, 2)}</pre>
          </div>
        ) : null}
        {user && (
          <div className="row">
            The Pass returned from the server
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {user.futurepass === userSession?.futurepass
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
