'use client';
import React from 'react';
import { useAuth } from '@futureverse/auth-react';
import { useState } from 'react';
import { CopyText } from './CopyText';

export function TokenInfo() {
  const { userSession } = useAuth();

  const [hideAccess, setHideAccess] = useState(true);
  const [hideRefresh, setHideRefresh] = useState(true);

  const toggleAccess = () => {
    setHideAccess(!hideAccess);
  };

  const toggleRefresh = () => {
    setHideRefresh(!hideRefresh);
  };

  return (
    <div className="">
      <h2 style={{ marginTop: '8px' }}>User Session (Debug)</h2>
      <div className="card" style={{ marginTop: '16px' }}>
        <div className="inner" style={{ gridColumn: 'span 2' }}>
          <div className="grid cols-1">
            Please note that this is a debug view and you should not be exposing
            access tokens in production environments.
          </div>
          <div className="grid cols-1">
            <div className="row content-row">
              <div className="title">
                Access Token{' '}
                <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>
                  (Click To Reveal)
                </span>
              </div>
              <div
                className={`content hide-content-cell ${
                  hideAccess ? 'hide' : ''
                }`}
                onClick={toggleAccess}
              >
                {hideAccess ? (
                  'ThIsaRaNdOmStRiNgToMaKeThIsLoOkReAlBeHiNdThEbLuR='
                ) : (
                  <CopyText
                    text={userSession?.user?.access_token || ''}
                    fullWidthFlex={true}
                  >
                    {userSession?.user?.access_token}
                  </CopyText>
                )}
              </div>
              <div className="title" style={{ marginTop: '8px' }}>
                Refresh Token{' '}
                <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>
                  (Click To Reveal)
                </span>
              </div>
              <div
                className={`content hide-content-cell ${
                  hideRefresh ? 'hide' : ''
                }`}
                onClick={toggleRefresh}
              >
                {hideRefresh ? (
                  'ThIsaRaNdOmStRiNgToMaKeThIsLoOkReAlBeHiNdThEbLuR='
                ) : (
                  <CopyText
                    text={userSession?.user?.refresh_token || ''}
                    fullWidthFlex={true}
                  >
                    {userSession?.user?.refresh_token}
                  </CopyText>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
