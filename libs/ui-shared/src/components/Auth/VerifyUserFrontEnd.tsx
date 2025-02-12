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

export function VerifyUserFrontEnd() {
  const { userSession } = useAuth();

  const idpUrl = process.env.NEXT_PUBLIC_FUTUREPASS_PASS_IDP_URL;

  const {
    data: userFrontEnd,
    isPending: userFrontEndLoading,
    mutate: validateUserFrontEnd,
  } = useMutation({
    mutationFn: () =>
      fetch(idpUrl + '/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: \`Bearer \${userSession?.user?.access_token}\`,
        },
      }).then(res => res.json()),
  });

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={''} helperCode={undefined}>
            <h3>Verify User Front End</h3>
          </CodeView>
        </div>
        <div className="row">
          <button
            className="green no-margin"
            onClick={() => validateUserFrontEnd()}
          >
            Verify User Front End
          </button>
        </div>
        {userFrontEndLoading ? (
          <div className="row">
            <div className="flex-row">
              <Spinner /> Verifying User on Front End...
            </div>
          </div>
        ) : userFrontEnd ? (
          <div className="row">
            <pre className="">{JSON.stringify(userFrontEnd, null, 2)}</pre>
          </div>
        ) : null}
        {userFrontEnd && (
          <div className="row">
            The Pass returned from the server
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {userFrontEnd.futurepass === userSession?.futurepass
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

export function VerifyUserFrontEnd() {
  const { userSession } = useAuth();

  const idpUrl = process.env.NEXT_PUBLIC_FUTUREPASS_PASS_IDP_URL;

  const {
    data: userFrontEnd,
    isPending: userFrontEndLoading,
    mutate: validateUserFrontEnd,
  } = useMutation({
    mutationFn: () =>
      fetch(idpUrl + '/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${userSession?.user?.access_token}`,
        },
      }).then(res => res.json()),
  });

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={userApiCodeString}>
            <h3>Verify User Front End</h3>
          </CodeView>
        </div>
        <div className="row">
          <button
            className="green no-margin"
            onClick={() => validateUserFrontEnd()}
          >
            Verify User Front End
          </button>
        </div>
        {userFrontEndLoading ? (
          <div className="row">
            <div className="flex-row">
              <Spinner /> Verifying User on Front End...
            </div>
          </div>
        ) : userFrontEnd ? (
          <div className="row">
            <pre className="">{JSON.stringify(userFrontEnd, null, 2)}</pre>
          </div>
        ) : null}
        {userFrontEnd && (
          <div className="row">
            The Pass returned from the server
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {userFrontEnd.futurepass === userSession?.futurepass
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
