'use client';

import { useAssets } from '@futureverse/asset-register-react/v2';
import { AssetModel } from '@futureverse/asset-register/models';

import React from 'react';

const DevPortalUrl = 'https://ar-docs.futureverse.cloud/manage-assets/';

type AssetSelectorProps = {
  onSelected: (asset: string, devPortalUrl: string) => void;
  title: string;
  address: string;
};
export const AssetSelector = ({
  onSelected,
  title,
  address,
}: AssetSelectorProps) => {
  const [showSelector, setShowSelector] = React.useState(false);

  const assetQueryParams = React.useMemo(
    () => ({
      first: 12,
      addresses: [address],
    }),
    [address]
  );

  const handleSelect = (asset: AssetModel) => {
    onSelected(
      `${asset.collectionId}:${asset.tokenId}`,
      `${DevPortalUrl}${asset.id}`
    );
    setShowSelector(false);
  };

  const {
    assets,
    reactQuery: { hasNextPage, fetchNextPage, isFetching, error },
  } = useAssets(assetQueryParams, {
    enabled: showSelector,
    refetchOnWindowFocus: false,
  } as any);

  return (
    <div>
      <button className="green" onClick={() => setShowSelector(!showSelector)}>
        Select Asset
      </button>
      {showSelector && (
        <div className="asset-selector-modal">
          <div className="card">
            <div className="inner">
              <div className="row">
                <h2>{title}</h2>
                <button
                  className="close-code-btn green"
                  onClick={() => setShowSelector(false)}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <g>
                        <polygon
                          points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512
                 512,452.922 315.076,256 		"
                        />
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
              <div className="row asset-row">
                {assets.map(asset => (
                  <div key={asset.id} className="asset-card">
                    <div className="asset-card-inner">
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
                        <button
                          className="green"
                          onClick={() => handleSelect(asset)}
                        >
                          Select
                        </button>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`${DevPortalUrl}${asset.id}`}
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
        </div>
      )}
    </div>
  );
};
