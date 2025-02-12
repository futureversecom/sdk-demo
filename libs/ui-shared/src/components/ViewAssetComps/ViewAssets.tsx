'use client';

import {
  useAssets,
  useCollections,
} from '@futureverse/asset-register-react/v2';
import { useAuth } from '@futureverse/auth-react';

import React from 'react';
import CodeView from '../CodeView';
import { shortAddress } from '../../lib';

const DevPortalUrl = 'https://ar-docs.futureverse.cloud/manage-assets/';

export const ViewAssets = () => {
  const { userSession } = useAuth();

  const [walletsToUse, setWalletsToUse] = React.useState<string[] | null>(
    userSession ? [userSession.futurepass, userSession.eoa] : null
  );

  const [collectionId, setCollectionId] = React.useState<string | null>(null);

  const collectionQueryParams = React.useMemo(
    () => ({
      first: 100,
      addresses: walletsToUse,
    }),
    [walletsToUse]
  );

  const assetQueryParams = React.useMemo(
    () => ({
      first: 20,
      addresses: walletsToUse,
      collectionIds: [collectionId],
    }),
    [walletsToUse, collectionId]
  );

  const {
    collections,
    reactQuery: { isFetching: isCollectionFetching },
  } = useCollections(collectionQueryParams, {
    enabled: !!userSession,
    refetchOnWindowFocus: false,
  } as any);

  const {
    assets,
    reactQuery: { hasNextPage, fetchNextPage, isFetching, error },
  } = useAssets(assetQueryParams, {
    enabled: !!collectionId && !!userSession,
    refetchOnWindowFocus: false,
  } as any);

  const codeString = ``;

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString}>
            <h3>View Assets</h3>
          </CodeView>
        </div>
        <div className="row">
          <label>
            Wallet to Use
            <select
              value={walletsToUse || ''}
              className="w-full builder-input"
              onChange={e => {
                setWalletsToUse(
                  e.target.value ? e.target.value.split(',') : null
                );
              }}
            >
              <option
                value={
                  '0x6476E42A52A58826dC4C827f1c43ACc152eAc8ca,0xffFfffFf0000000000000000000000000000463c'
                }
              >
                Test EOA & Pass.Online
              </option>
              {userSession && (
                <option
                  value={[userSession.futurepass, userSession.eoa].join(',')}
                >
                  {shortAddress(userSession.futurepass)} /{' '}
                  {shortAddress(userSession.eoa)}
                </option>
              )}
            </select>
          </label>
        </div>
        {isCollectionFetching && (
          <div className="row asset-row">Collections Loading</div>
        )}
        {!isCollectionFetching &&
          (!collections || collections.length === 0) && (
            <div className="row asset-row">Collections Loading</div>
          )}
        {!isCollectionFetching && collections && collections.length > 0 && (
          <div className="row asset-row">
            <label>
              Collection
              <select
                value={collectionId || ''}
                className="w-full builder-input"
                onChange={e => {
                  setCollectionId(e.target.value);
                }}
              >
                <option value="">Select Collection</option>
                {collections.map((collection, i) => (
                  <option
                    key={`${collection.chainId}:${collection.name}:${i}`}
                    value={`${collection.chainId}:${collection.chainType}:${collection.location}`}
                  >
                    {collection.chainId}: {collection.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div className="row asset-row asset-selector-card">
          {assets
            .sort((a, b) =>
              parseInt(a.tokenId) < parseInt(b.tokenId) ? -1 : 1
            )
            .map(asset => (
              <div key={asset.id} className="asset-card">
                <div className="asset-card-inner">
                  {asset?.metadata?.properties?.image && (
                    <div className="asset-image flex-col ">
                      <img src={asset.metadata.properties.image} alt="asset" />
                    </div>
                  )}
                  <div className="asset-name flex-col">
                    <div className="title">Asset Type:</div>
                    <div className="value">{asset.assetType}</div>
                  </div>
                  <div className="asset-collection-id flex-col">
                    <div className="title">Collection ID:</div>
                    <div className="value">{asset.collectionId}</div>
                  </div>
                  <div className="asset-token-id flex-col">
                    <div className="title">Token ID:</div>
                    <div className="value">{asset.tokenId}</div>
                  </div>
                  <div className="button-row">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${DevPortalUrl}${asset.id}`}
                      className="btn green"
                    >
                      View in Dev Portal
                    </a>
                  </div>
                </div>
                <hr style={{ borderWidth: '1px' }} />
              </div>
            ))}
        </div>

        <div className="row">
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetching}>
              Load More
            </button>
          )}
          {isFetching && <span>Loading More Assets...</span>}
          {error && <div>Error loading assets</div>}
        </div>
      </div>
    </div>
  );
};
