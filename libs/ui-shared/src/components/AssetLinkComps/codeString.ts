export const codeString = `
import React, { useEffect, useMemo, useState } from 'react';
import { useRootStore } from '../../hooks/useRootStore';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import CodeView from '../CodeView';
import {
  useGetARTM,
  useSignAndSubmitTransaction,
} from '@futureverse/asset-register-react/v2';
import { Address } from 'viem';
import { ExternalLink } from '../Icons';
import { TransactionStatus } from './TransactionStatus';
import { AssetSelector } from './AssetSelector';
import { codeString } from './codeString';

export const AssetLinkEquip = () => {
  const { userSession } = useAuth();
  const signer = useFutureverseSigner();
  const [address, setAddress] = useState<Address>();
  useEffect(() => {
    (async () => {
      if (signer) {
        setAddress((await signer.getAddress()) as Address);
      }
    })();
  }, [signer]);

  if (!userSession || !address) {
    return <h1>Sign in to interact with assets</h1>;
  }

  return <AssetLinkEquipForm address={address} />;
};

export const AssetLinkEquipForm = ({ address }: { address: string }) => {
  const { resetState, signed, result, error } = useRootStore(state => state);

  const [parentAsset, setParentAsset] = useState<string>('');
  const [childAsset, setChildAsset] = useState<string>('');
  const [parentDevPortalUrl, setParentDevPortalUrl] = useState<string>('');
  const [childDevPortalUrl, setChildDevPortalUrl] = useState<string>('');

  const [path, setPath] = useState<string>('equipWith_asmBrain');

  const [action, setAction] = useState<string>('create');

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const buttonDisabled = useMemo(() => {
    return disable || !parentAsset || !childAsset;
  }, [disable, parentAsset, childAsset]);

  const operations = useMemo(() => {
    const operation = {
      type: 'asset-link',
      action,
      args: [path, \`did:fv-asset:\${parentAsset}\`, \`did:fv-asset:\${childAsset}\`],
    };
    return [operation];
  }, [path, parentAsset, childAsset, action]);

  const operationsText = useMemo(() => {
    return JSON.stringify(operations, undefined, 2);
  }, [operations]);

  const onParentAssetSelected = (asset: string, url: string) => {
    setParentAsset(asset);
    setParentDevPortalUrl(url);
  };

  const onChildAssetSelected = (asset: string, url: string) => {
    setChildAsset(asset);
    setChildDevPortalUrl(url);
  };

  const {
    artm,
    reactQuery: { refetch: getARTM },
  } = useGetARTM(
    {
      address,
      operations,
    },
    { enabled: false }
  );

  const { submitAsync, transaction } = useSignAndSubmitTransaction();

  const submitARTM = async () => {
    const { data: artm } = await getARTM();
    if (!artm) {
      return;
    }

    return submitAsync({ artm, check: false });
  };

  return (
    <div className={\`card \${disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>Asset Link Equip</h3>
          </CodeView>
        </div>
        <div className="row">
          <label>
            Action
            <select
              value={action}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setAction(e.target.value);
              }}
            >
              <option value="create">Create</option>
              <option value="delete">Delete</option>
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            Path
            <input
              type="text"
              value={path}
              className="w-full builder-input"
              onChange={e => {
                resetState();
                setPath(e.target.value);
              }}
              disabled={disable}
            />
          </label>
        </div>
        <div className="row">
          <h4
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Parent Asset
            {parentDevPortalUrl && (
              <a
                className="code-btn green"
                style={{ display: 'flex', alignItems: 'center' }}
                target="_blank"
                rel="noopener noreferrer"
                href={parentDevPortalUrl}
              >
                View in Dev Portal
                <ExternalLink />
              </a>
            )}
          </h4>
          <AssetSelector
            onSelected={onParentAssetSelected}
            title="Select parent asset"
            address={address}
          />
          {parentAsset}
        </div>

        <div className="row">
          <h4
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Child Asset
            {childDevPortalUrl && (
              <a
                className="code-btn green"
                style={{ display: 'flex', alignItems: 'center' }}
                target="_blank"
                rel="noopener noreferrer"
                href={childDevPortalUrl}
              >
                View in Dev Portal
                <ExternalLink />
              </a>
            )}
          </h4>
          <AssetSelector
            onSelected={onChildAssetSelected}
            title="Select child asset"
            address={address}
          />
          {childAsset}
        </div>
        <div className="row">
          <label>
            Operations:
            <pre
              className="w-full"
              style={{ height: '200px', textTransform: 'none' }}
            >
              {operationsText}
            </pre>
          </label>
        </div>

        <div className="row">
          <button
            className={\`w-full builder-input green \${
              buttonDisabled ? 'disabled' : ''
            }\`}
            onClick={() => {
              resetState();
              submitARTM();
            }}
            disabled={buttonDisabled}
          >
            Submit
          </button>
        </div>
        {artm?.message && (
          <div className="row">
            <label>
              artm message:
              <pre
                className="w-full"
                style={{ height: '200px', textTransform: 'none' }}
              >
                {artm?.message}
              </pre>
            </label>
          </div>
        )}
        {transaction && (
          <div className="row">
            <label>response:</label>
            <pre>{JSON.stringify(transaction, undefined, 2)}</pre>
          </div>
        )}
        {artm?.transactionHash && (
          <TransactionStatus transactionHash={artm.transactionHash} />
        )}
      </div>
    </div>
  );
};

`;
