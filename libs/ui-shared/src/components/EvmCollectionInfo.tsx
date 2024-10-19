import React from 'react';

export function EvmCollectionInfo({
  collectionInfo,
  collectionOwner,
  isFetching,
}: {
  collectionInfo?: string | null;
  collectionOwner?: string | null;
  isFetching: boolean;
}) {
  return (
    <>
      {!isFetching && !collectionInfo && !collectionOwner && (
        <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
          Collection not found
        </span>
      )}
      {isFetching && (
        <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
          Checking Collection...
        </span>
      )}
      {collectionOwner && (
        <span style={{ display: 'inline-block', fontSize: '0.8rem' }}>
          Collection Exists
        </span>
      )}
      {(collectionInfo as string) && (
        <div style={{ display: 'inline-block', fontSize: '0.8rem' }}>
          Collection Name: {collectionInfo as string}
        </div>
      )}
    </>
  );
}
