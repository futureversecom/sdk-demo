import { useAuth, useConnector } from '@futureverse/auth-react';

import { useQuery } from '@tanstack/react-query';

import { useTrnApi } from '../providers';
import { useIsMounted, useRnsResolveAddress, useTransactQuery } from '../hooks';

import { useAccount } from 'wagmi';
import { getBalance } from '../lib/utils';
import CodeView from './CodeView';
import { LogIn } from './Navigation';
import { CopyText } from './CopyText';

const codeString = `
import { useAuth, useConnector } from '@futureverse/auth-react';

import { useQuery } from '@tanstack/react-query';

import { useTrnApi } from '../providers';
import { useIsMounted, useRnsResolveAddress, useTransactQuery } from '../hooks';

import { useAccount } from 'wagmi';
import { getBalance } from '../lib/utils';
import CodeView from './CodeView';
import { LogIn } from './Navigation';
import { CopyText } from './CopyText';

const ASTO_ASSET_ID = 17508;
const SYLO_ASSET_ID = 3172;

const options = {
  localeMatcher: 'best fit',
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
} as const;

const formatter = new Intl.NumberFormat('en-US', options);

export default function Home({ title }: { title: string }) {
  const { address } = useAccount();

  const isMounted = useIsMounted();
  const { userSession, authMethod, authClient } = useAuth();
  const { connector } = useConnector();

  const { trnApi } = useTrnApi();

  const transactionQuery = useTransactQuery();

  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, 2],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const xrpBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, 2],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.futurepass as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, 1],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const rootBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, 1],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.futurepass as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const astoBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, ASTO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, ASTO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const astoBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, ASTO_ASSET_ID],
    queryFn: async () =>
      getBalance(
        transactionQuery,
        userSession?.futurepass as string,
        ASTO_ASSET_ID
      ),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const syloBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, SYLO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, SYLO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const syloBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, SYLO_ASSET_ID],
    queryFn: async () =>
      getBalance(
        transactionQuery,
        userSession?.futurepass as string,
        SYLO_ASSET_ID
      ),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const { data: eoaRns, isFetching: eoaFetching } = useRnsResolveAddress(
    userSession?.eoa as string,
    authClient
  );
  const { data: fPassRns, isFetching: fPassFetching } = useRnsResolveAddress(
    userSession?.futurepass as string,
    authClient
  );

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="row">
        {userSession && (
          <CodeView code={codeString}>
            <h1>{title}</h1>
          </CodeView>
        )}
        {!userSession && <h1>{title}</h1>}
      </div>

      <div>
        {!userSession && (
          <div className="auto-grid">
            <div className="card">
              <div className="inner">
                <h3>
                  Connect with your Pass to interact with the SDK Playground
                </h3>
                <LogIn />
              </div>
            </div>
          </div>
        )}

        {userSession && (
          <>
            <div className="auto-grid">
              <div className="card">
                <div className="inner" style={{ gridColumn: 'span 2' }}>
                  <div className="row">Connector: {connector?.name}</div>
                  <div className="row">Authentication Method: {authMethod}</div>
                  <div className="row">
                    User Chain ID: {userSession.chainId}
                  </div>
                </div>
              </div>
            </div>
            <div className="auto-grid " style={{ marginTop: '16px' }}>
              {connector?.id !== 'xaman' && authMethod === 'eoa' && (
                <div>
                  <h2>EOA</h2>
                  <div className="card">
                    <div className="inner">
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Addresses
                      </span>
                      <div className="row address-row">
                        <div className="title">User EOA</div>
                        <CopyText text={userSession.eoa}>
                          {userSession.eoa}
                        </CopyText>
                      </div>
                      <div className="row address-row">
                        <div className="title">User Address from Wagmi</div>
                        <CopyText text={address?.toString() ?? ''}>
                          {address?.toString() ?? ''}
                        </CopyText>
                      </div>

                      <div className="row address-row">
                        <div className="title">User Address RNS</div>
                        {eoaFetching && <div className="row">Fetching RNS</div>}
                        {!eoaFetching && !eoaRns && (
                          <div className="row">No RNS set for Eoa</div>
                        )}
                        {eoaRns && <CopyText text={eoaRns}>{eoaRns}</CopyText>}
                      </div>
                    </div>
                  </div>
                  <div className="card" style={{ marginTop: '16px' }}>
                    <div className="inner">
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Balances
                      </span>

                      <div className="row">
                        XRP Balance:{' '}
                        {formatter.format(Number(xrpBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        XRP
                      </div>
                      <div className="row">
                        ROOT Balance:{' '}
                        {formatter.format(Number(rootBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        ROOT
                      </div>
                      <div className="row">
                        ASTO Balance:{' '}
                        {formatter.format(Number(astoBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        ASTO
                      </div>
                      <div className="row">
                        SYLO Balance:{' '}
                        {formatter.format(Number(syloBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        SYLO
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="">
                <h2>Pass.Online</h2>

                <div className="card">
                  <div className="inner">
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Addresses
                    </span>
                    <div className="row address-row">
                      <div className="title">User Pass Address</div>
                      <CopyText text={userSession.futurepass}>
                        {userSession.futurepass}
                      </CopyText>
                    </div>
                    <div className="row address-row">
                      <div className="title">User Address RNS</div>
                      {fPassFetching && <div className="row">Fetching RNS</div>}
                      {!fPassFetching && !fPassRns && (
                        <div className="row">No RNS set for Eoa</div>
                      )}
                      {fPassRns && (
                        <CopyText text={fPassRns}>{fPassRns}</CopyText>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card" style={{ marginTop: '16px' }}>
                  <div className="inner">
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Balances
                    </span>
                    <div className="row">
                      XRP Balance:{' '}
                      {formatter.format(Number(xrpBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      XRP
                    </div>
                    <div className="row">
                      ROOT Balance:{' '}
                      {formatter.format(Number(rootBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      ROOT
                    </div>
                    <div className="row">
                      ASTO Balance:{' '}
                      {formatter.format(Number(astoBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      ASTO
                    </div>
                    <div className="row">
                      SYLO Balance:{' '}
                      {formatter.format(Number(syloBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      SYLO
                    </div>
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
`;

const ASTO_ASSET_ID = 17508;
const SYLO_ASSET_ID = 3172;

const options = {
  localeMatcher: 'best fit',
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
} as const;

const formatter = new Intl.NumberFormat('en-US', options);

export default function Home({ title }: { title: string }) {
  const { address } = useAccount();

  const isMounted = useIsMounted();
  const { userSession, authMethod, authClient } = useAuth();
  const { connector } = useConnector();

  const { trnApi } = useTrnApi();

  const transactionQuery = useTransactQuery();

  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, 2],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const xrpBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, 2],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.futurepass as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, 1],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const rootBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, 1],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.futurepass as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const astoBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, ASTO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, ASTO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const astoBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, ASTO_ASSET_ID],
    queryFn: async () =>
      getBalance(
        transactionQuery,
        userSession?.futurepass as string,
        ASTO_ASSET_ID
      ),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const syloBalanceOnTrn = useQuery({
    queryKey: ['balance', userSession?.eoa, SYLO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, userSession?.eoa as string, SYLO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.eoa &&
      connector?.id !== 'xaman' &&
      authMethod === 'eoa' &&
      !!transactionQuery,
  });

  const syloBalanceOnTrnFp = useQuery({
    queryKey: ['balance', userSession?.futurepass, SYLO_ASSET_ID],
    queryFn: async () =>
      getBalance(
        transactionQuery,
        userSession?.futurepass as string,
        SYLO_ASSET_ID
      ),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!userSession?.futurepass &&
      !!transactionQuery,
  });

  const { data: eoaRns, isFetching: eoaFetching } = useRnsResolveAddress(
    userSession?.eoa as string,
    authClient
  );
  const { data: fPassRns, isFetching: fPassFetching } = useRnsResolveAddress(
    userSession?.futurepass as string,
    authClient
  );

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="row">
        {userSession && (
          <CodeView code={codeString}>
            <h1>{title}</h1>
          </CodeView>
        )}
        {!userSession && <h1>{title}</h1>}
      </div>

      <div>
        {!userSession && (
          <div className="auto-grid">
            <div className="card">
              <div className="inner">
                <h3>
                  Connect with your Pass to interact with the SDK Playground
                </h3>
                <LogIn />
              </div>
            </div>
          </div>
        )}

        {userSession && (
          <>
            <div className="auto-grid">
              <div className="card">
                <div className="inner" style={{ gridColumn: 'span 2' }}>
                  <div className="row">Connector: {connector?.name}</div>
                  <div className="row">Authentication Method: {authMethod}</div>
                  <div className="row">
                    User Chain ID: {userSession.chainId}
                  </div>
                </div>
              </div>
            </div>
            <div className="auto-grid " style={{ marginTop: '16px' }}>
              {connector?.id !== 'xaman' && authMethod === 'eoa' && (
                <div>
                  <h2>EOA</h2>
                  <div className="card">
                    <div className="inner">
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Addresses
                      </span>
                      <div className="row address-row">
                        <div className="title">User EOA</div>
                        <CopyText text={userSession.eoa}>
                          {userSession.eoa}
                        </CopyText>
                      </div>
                      <div className="row address-row">
                        <div className="title">User Address from Wagmi</div>
                        <CopyText text={address?.toString() ?? ''}>
                          {address?.toString() ?? ''}
                        </CopyText>
                      </div>

                      <div className="row address-row">
                        <div className="title">User Address RNS</div>
                        {eoaFetching && <div className="row">Fetching RNS</div>}
                        {!eoaFetching && !eoaRns && (
                          <div className="row">No RNS set for Eoa</div>
                        )}
                        {eoaRns && <CopyText text={eoaRns}>{eoaRns}</CopyText>}
                      </div>
                    </div>
                  </div>
                  <div className="card" style={{ marginTop: '16px' }}>
                    <div className="inner">
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Balances
                      </span>

                      <div className="row">
                        XRP Balance:{' '}
                        {formatter.format(Number(xrpBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        XRP
                      </div>
                      <div className="row">
                        ROOT Balance:{' '}
                        {formatter.format(Number(rootBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        ROOT
                      </div>
                      <div className="row">
                        ASTO Balance:{' '}
                        {formatter.format(Number(astoBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        ASTO
                      </div>
                      <div className="row">
                        SYLO Balance:{' '}
                        {formatter.format(Number(syloBalanceOnTrn.data ?? 0)) ??
                          'loading'}{' '}
                        SYLO
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="">
                <h2>Pass.Online</h2>

                <div className="card">
                  <div className="inner">
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Addresses
                    </span>
                    <div className="row address-row">
                      <div className="title">User Pass Address</div>
                      <CopyText text={userSession.futurepass}>
                        {userSession.futurepass}
                      </CopyText>
                    </div>
                    <div className="row address-row">
                      <div className="title">User Address RNS</div>
                      {fPassFetching && <div className="row">Fetching RNS</div>}
                      {!fPassFetching && !fPassRns && (
                        <div className="row">No RNS set for Eoa</div>
                      )}
                      {fPassRns && (
                        <CopyText text={fPassRns}>{fPassRns}</CopyText>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card" style={{ marginTop: '16px' }}>
                  <div className="inner">
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Balances
                    </span>
                    <div className="row">
                      XRP Balance:{' '}
                      {formatter.format(Number(xrpBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      XRP
                    </div>
                    <div className="row">
                      ROOT Balance:{' '}
                      {formatter.format(Number(rootBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      ROOT
                    </div>
                    <div className="row">
                      ASTO Balance:{' '}
                      {formatter.format(Number(astoBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      ASTO
                    </div>
                    <div className="row">
                      SYLO Balance:{' '}
                      {formatter.format(Number(syloBalanceOnTrnFp.data ?? 0)) ??
                        'loading'}{' '}
                      SYLO
                    </div>
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
