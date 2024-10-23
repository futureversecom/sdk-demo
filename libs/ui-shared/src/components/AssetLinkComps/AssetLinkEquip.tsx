import React, { useMemo } from 'react';
import { useRootStore } from '../../hooks/useRootStore';
import { useAuth } from '@futureverse/auth-react';
import CodeView from '../CodeView';

const codeString = `
import React from 'react';
`;

export const AssetLinkEquip = () => {
  const { userSession } = useAuth();

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const buttonDisabled = useMemo(() => {
    return disable;
  }, [disable]);

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Asset Link Equip</h3>
          </CodeView>
        </div>
        <div className="row">something here</div>

        <div className="row">
          <button
            className={`w-full builder-input green ${
              buttonDisabled ? 'disabled' : ''
            }`}
            onClick={() => {
              resetState();
            }}
            disabled={buttonDisabled}
          >
            Start Transfer
          </button>
        </div>
      </div>
    </div>
  );
};
