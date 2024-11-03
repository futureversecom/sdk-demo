'use client';

import { useGetTransaction } from '@futureverse/asset-register-react/v2';
import { TransactionHash } from '@futureverse/asset-register/types';
import React, { FC } from 'react';

type Props = {
  transactionHash: string;
};
export const TransactionStatus: FC<Props> = ({ transactionHash }) => {
  const {
    transaction,
    reactQuery: { data },
  } = useGetTransaction(
    { transactionHash: transactionHash as TransactionHash },
    {
      refetchInterval: query => {
        return query.state.data?.status === 'PENDING' ? 5000 : false;
      },
    }
  );

  if (!transaction) return null;
  return (
    <div className="row">
      <label>
        Transaction:{' '}
        {data?.status === 'PENDING' && (
          <>
            <div
              style={{ width: '16px', display: 'inline-block' }}
              className="loader"
            ></div>
            <span>Checking the status of the transaction</span>
          </>
        )}
        <pre
          className="w-full"
          style={{ height: '200px', textTransform: 'none' }}
        >
          {JSON.stringify(transaction, undefined, 2)}
        </pre>
      </label>
    </div>
  );
};
