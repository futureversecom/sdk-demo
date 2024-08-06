import React from 'react';
import { ConnectorId, useAuth, useConnector } from '@futureverse/auth-react';

import { useQuery } from '@tanstack/react-query';

import { ethers } from 'ethers';
import { useTrnApi } from '../providers';
import { useIsMounted } from '../hooks';

import { useAccount } from 'wagmi';

export default function Home({ title }: { title: string }) {
  const { address } = useAccount();

  const isMounted = useIsMounted();
  const { userSession, authMethod } = useAuth();

  const { connectAndSignIn, disconnect, isConnected, connectors, connector } =
    useConnector();

  const { trnApi } = useTrnApi();

  const getBalance = async (address: string, assetId: number) => {
    const balanceData = await trnApi?.rpc.assetsExt.freeBalance(
      assetId,
      address
    );

    const balance = balanceData
      ? ethers.formatUnits(balanceData?.toString(), 6)
      : 0;

    console.log('Balance:', balance);

    return balance;
  };

  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, 2],
    queryFn: async () => getBalance(userSession?.eoa as string, 2),
    enabled: !!trnApi && !!userSession && !!userSession?.eoa,
  });

  const xrpBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, 2],
    queryFn: async () => getBalance(userSession?.futurepass as string, 2),
    enabled: !!trnApi && !!userSession && !!userSession?.futurepass,
  });

  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, 1],
    queryFn: async () => getBalance(userSession?.eoa as string, 1),
    enabled: !!trnApi && !!userSession && !!userSession?.eoa,
  });

  const rootBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, 1],
    queryFn: async () => getBalance(userSession?.futurepass as string, 1),
    enabled: !!trnApi && !!userSession && !!userSession?.futurepass,
  });

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{title}</h1>

      <div>
        {userSession == null ? (
          <div>
            {connectors.map(conn => (
              <button
                key={conn.id}
                onClick={() =>
                  connectAndSignIn(conn.id as ConnectorId, 'popup')
                }
              >
                {conn.icon && (
                  // eslint-disable-next-line
                  <img src={conn.icon} width={20} height={20} />
                )}
                Connect {conn.name}
              </button>
            ))}

            {isConnected && (
              <button
                onClick={() => {
                  if (connector?.id) {
                    disconnect();
                  }
                }}
              >
                Disconnect
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="asset-grid">
              <div className="card">
                <div className="inner" style={{ gridColumn: 'span 2' }}>
                  <div className="row">Authentication Method: {authMethod}</div>
                  <div className="row">
                    User Chain ID: {userSession.chainId}
                  </div>
                </div>
              </div>
            </div>
            <div className="asset-grid mt-32">
              <div className="card">
                <div className="inner">
                  <h2>EOA</h2>
                  <div className="row">User EOA: {userSession.eoa}</div>
                  <div className="row">User Address from Wagmi: {address}</div>
                  <div className="row">
                    User Balance: {xrpBalanceOnTrn.data ?? 'loading'} XRP
                  </div>
                  <div className="row">
                    User Balance: {rootBalanceOnTrn.data ?? 'loading'} ROOT
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="inner">
                  <h2>FuturePass</h2>
                  <div className="row">
                    User FuturePass: {userSession.futurepass}
                  </div>
                  <div className="row">
                    User Balance: {xrpBalanceOnTrnFp.data ?? 'loading'} XRP
                  </div>
                  <div className="row">
                    User Balance: {rootBalanceOnTrnFp.data ?? 'loading'} ROOT
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
