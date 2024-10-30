'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@futureverse/auth-react';

import { useQuery } from '@tanstack/react-query';

import { useTrnApi } from '@futureverse/transact-react';

import { useRnsResolveAddress, useTransactQuery } from '../hooks';
import { useAccount } from 'wagmi';
import { getBalance } from '../lib/utils';
import CodeView from './CodeView';
import { CopyText } from './CopyText';

const codeString = `
import React, { useMemo } from 'react';
import { useAuth } from '@futureverse/auth-react';

import { useQuery } from '@tanstack/react-query';

import { useTrnApi } from '@futureverse/transact-react';

import { useRnsResolveAddress, useTransactQuery } from '../hooks';
import { useAccount } from 'wagmi';
import { getBalance } from '../lib/utils';
import CodeView from './CodeView';
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

type AccountCardProps = {
  title: string;
  type: 'eoa' | 'futurepass';
};

export function AccountCard({ title, type }: AccountCardProps) {
  const { address } = useAccount();

  const { userSession, authClient } = useAuth();

  const { trnApi } = useTrnApi();

  const transactionQuery = useTransactQuery();

  const accountToCheck = useMemo(() => {
    if (!userSession) {
      return '';
    }
    return type === 'eoa' ? userSession?.eoa : userSession?.futurepass;
  }, [type, userSession]);

  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, 2],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, 1],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const astoBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, ASTO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, ASTO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const syloBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, SYLO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, SYLO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const { data: accountRns, isFetching: rnsFetching } = useRnsResolveAddress(
    accountToCheck as string,
    authClient
  );

  return (
    <div className="">
      <CodeView code={codeString}>
        <h2>{title}</h2>
      </CodeView>

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
            <CopyText text={accountToCheck}>{accountToCheck}</CopyText>
          </div>
          {type === 'eoa' && (
            <div className="row address-row">
              <div className="title">User Address from Wagmi</div>
              <CopyText text={address?.toString() ?? ''}>
                {address?.toString() ?? ''}
              </CopyText>
            </div>
          )}
          <div className="row address-row">
            <div className="title">User Address RNS</div>
            {rnsFetching && <div className="row">Fetching RNS</div>}
            {!rnsFetching && !accountRns && (
              <div className="row">No RNS set for Eoa</div>
            )}
            {accountRns && <CopyText text={accountRns}>{accountRns}</CopyText>}
          </div>
          <div className="inner-card">
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

type AccountCardProps = {
  title: string;
  type: 'eoa' | 'futurepass';
};

export function AccountCard({ title, type }: AccountCardProps) {
  const { address } = useAccount();

  const { userSession, authClient } = useAuth();

  const { trnApi } = useTrnApi();

  const transactionQuery = useTransactQuery();

  const accountToCheck = useMemo(() => {
    if (!userSession) {
      return '';
    }
    return type === 'eoa' ? userSession?.eoa : userSession?.futurepass;
  }, [type, userSession]);

  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, 2],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, 1],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const astoBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, ASTO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, ASTO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const syloBalanceOnTrn = useQuery({
    queryKey: ['balance', type, accountToCheck, SYLO_ASSET_ID],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, SYLO_ASSET_ID),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  const { data: accountRns, isFetching: rnsFetching } = useRnsResolveAddress(
    accountToCheck as string,
    authClient
  );

  return (
    <div className="">
      <CodeView code={codeString}>
        <h2>{title}</h2>
      </CodeView>

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
            <CopyText text={accountToCheck}>{accountToCheck}</CopyText>
          </div>
          {type === 'eoa' && (
            <div className="row address-row">
              <div className="title">User Address from Wagmi</div>
              <CopyText text={address?.toString() ?? ''}>
                {address?.toString() ?? ''}
              </CopyText>
            </div>
          )}
          <div className="row address-row">
            <div className="title">User Address RNS</div>
            {rnsFetching && <div className="row">Fetching RNS</div>}
            {!rnsFetching && !accountRns && (
              <div className="row">No RNS set for Eoa</div>
            )}
            {accountRns && <CopyText text={accountRns}>{accountRns}</CopyText>}
          </div>
          <div className="inner-card">
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
                {formatter.format(Number(xrpBalanceOnTrn.data?.balance ?? 0)) ??
                  'loading'}{' '}
                XRP
              </div>
              <div className="row">
                ROOT Balance:{' '}
                {formatter.format(
                  Number(rootBalanceOnTrn.data?.balance ?? 0)
                ) ?? 'loading'}{' '}
                ROOT
              </div>
              <div className="row">
                ASTO Balance:{' '}
                {formatter.format(
                  Number(astoBalanceOnTrn.data?.balance ?? 0)
                ) ?? 'loading'}{' '}
                ASTO
              </div>
              <div className="row">
                SYLO Balance:{' '}
                {formatter.format(
                  Number(syloBalanceOnTrn.data?.balance ?? 0)
                ) ?? 'loading'}{' '}
                SYLO
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
