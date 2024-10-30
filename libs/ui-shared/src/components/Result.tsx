'use client';

import React from 'react';
import { useRootStore } from '../hooks/useRootStore';
import CodeView from './CodeView';

const codeString = `
import React from 'react';
import { useRootStore } from '../hooks/useRootStore';
import CodeView from './CodeView';

export default function Result() {
  const { result } = useRootStore(state => state);

  return (
    result && (
      <>
        <CodeView code={codeString}>
          <h2>Transaction Result</h2>
        </CodeView>
        <div className="card">
          <div className="inner">
            <div className="grid cols-1">
              <pre>{JSON.stringify(result, null, 2)}</pre>

              <a
                href={\`https://porcini.rootscan.io/extrinsic/$\{result.extrinsicId}\`}
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
`;

export default function Result() {
  const { result } = useRootStore(state => state);

  return (
    result && (
      <>
        <CodeView code={codeString}>
          <h2>Transaction Result</h2>
        </CodeView>
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
