import { useRootStore } from '@fv-sdk-demos/store-shared';
import React from 'react';

export default function Result() {
  const { result } = useRootStore(state => state);

  return (
    result && (
      <>
        <h2>Transaction Result</h2>
        <div className="card">
          <div className="inner">
            <div className="grid cols-1">
              <pre>{JSON.stringify(result, null, 2)}</pre>

              <a
                href={`https://porcini.rootscan.io/extrinsic/${result.extrinsicId}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{ textDecoration: 'underline' }}
              >
                View Extrinsic on Explorer ({result.extrinsicId})
              </a>
            </div>
          </div>
        </div>
      </>
    )
  );
}
