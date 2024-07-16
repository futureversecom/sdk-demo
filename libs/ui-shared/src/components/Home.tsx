import { useAuth, useConnector } from '@futureverse/auth-react';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectorId, SignInOptions, SignInType } from '@futureverse/auth';
import { useQuery } from '@tanstack/react-query';

import { ethers } from 'ethers';
import { useTrnApi } from '../providers';
import { useIsMounted } from '../hooks';

type ConnectorMap = Record<ConnectorId, SignInType>;
const connectorIdType: ConnectorMap = {
  metaMaskSDK: 'eoa',
  coinbaseWalletSDK: 'eoa',
  xaman: 'eoa',
  walletConnect: 'eoa',
  futureverseCustodialEmail: 'email',
  futureverseCustodialFacebook: 'facebook',
  futureverseCustodialGoogle: 'google',
};

export default function Home({ title }: { title: string }) {
  const isMounted = useIsMounted();

  const { signIn, userSession, authMethod } = useAuth();
  const { connector, address } = useAccount();
  const { connect, disconnect, isConnected } = useConnector();

  const { trnApi } = useTrnApi();

  const [account, setAccount] = useState<
    SignInOptions & { connector?: string }
  >({
    type: 'eoa',
  });

  useEffect(() => {
    setAccount(prev => ({
      ...prev,
      type: connectorIdType[connector?.id as ConnectorId],
      address: address as string,
      connector: connector?.id,
    }));
  }, [connector, address]);

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
          <>
            <div>
              <button
                onClick={() => {
                  connect('xaman').then(accounts => {
                    setAccount({
                      type: 'eoa',
                      address: accounts[0],
                      connector: 'xaman',
                    });
                  });
                }}
              >
                Connect Xaman
              </button>
              <button
                onClick={() => {
                  connect('metaMaskSDK').then(accounts => {
                    setAccount({
                      type: 'eoa',
                      address: accounts[0],
                      connector: 'metaMaskSDK',
                    });
                  });
                }}
              >
                Connect Metamask
              </button>
              <button
                onClick={() => {
                  connect('walletConnect').then(accounts => {
                    setAccount({
                      type: 'eoa',
                      address: accounts[0],
                      connector: 'walletConnect',
                    });
                  });
                }}
              >
                Connect Wallet Connect
              </button>
              <button
                onClick={() => {
                  connect('coinbaseWalletSDK').then(accounts => {
                    setAccount({
                      type: 'eoa',
                      address: accounts[0],
                      connector: 'coinbaseWalletSDK',
                    });
                  });
                }}
              >
                Connect Coinbase
              </button>
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
            {account.address && account.connector ? (
              <>
                <pre>
                  Connector: {account.connector}
                  <br />
                  Address: {account.address}
                </pre>
                <button onClick={() => signIn(account, 'popup')}>
                  Sign In FuturePass
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    connect('futureverseCustodialEmail');
                  }}
                >
                  Sign In Email
                </button>
                <button
                  onClick={() => {
                    connect('futureverseCustodialGoogle');
                  }}
                >
                  Sign In Google
                </button>
                <button
                  onClick={() => {
                    connect('futureverseCustodialFacebook');
                  }}
                >
                  Sign In Facebook
                </button>
              </>
            )}
          </>
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
