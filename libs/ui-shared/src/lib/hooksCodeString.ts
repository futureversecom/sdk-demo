export const hooksCodeString = `
/**
  * useGetUserBalance
  **/
import { getBalance } from '../lib/utils';
import { useTransactQuery } from '@/hooks/useTransactQuery';
import { useQuery } from '@tanstack/react-query';

export default function useGetUserBalance({
  walletAddress,
  assetId,
}: {
  walletAddress: string;
  assetId: number;
}) {
  const transactionQuery = useTransactQuery();

  return useQuery({
    queryKey: ['balance', walletAddress, assetId],
    queryFn: async () => getBalance(transactionQuery, walletAddress, assetId),
    enabled: !!walletAddress && !!assetId && !!transactionQuery,
  });
}


/**
  * getBalance() used in useGetUserBalance
  **/
export const getBalance = async (
  transactionQuery: RootQueryBuilder | undefined,
  address: string,
  assetId: number
) => {
  if (!transactionQuery) {
    return '0';
  }

  const balance = await transactionQuery?.checkBalance({
    walletAddress: address,
    assetId: assetId,
  });

  return balance
    ? formatUnits(BigInt(balance?.balance), balance?.decimals)
    : '0';
};

/**
  * useGetUserBalances
  **/
import { getBalances } from '../lib/utils';
import { useTransactQuery } from '@/hooks/useTransactQuery';
import { useQuery } from '@tanstack/react-query';

export default function useGetUserBalance(
  walletAssetIds: Array<{
    walletAddress: string;
    assetId: number;
  }>
) {
  const transactionQuery = useTransactQuery();

  return useQuery({
    queryKey: ['balances', walletAssetIds],
    queryFn: async () => getBalances(transactionQuery, walletAssetIds),
    enabled: !!walletAssetIds && !!transactionQuery,
  });
}


/**
  * getBalances() used in useGetUserBalances
  **/
export const getBalances = async (
  transactionQuery: RootQueryBuilder | undefined,
  walletAssetIds: { walletAddress: string; assetId: number }[]
) => {
  if (!transactionQuery) {
    return '0';
  }

  const walletBalances = await transactionQuery?.checkBalances(walletAssetIds);

  const balances = walletBalances?.map(walletBalance => {
    return {
      walletAddress: walletBalance.walletAddress,
      balance: formatUnits(
        BigInt(walletBalance?.balance),
        walletBalance?.decimals
      ),
    };
  });

  return balances;
};

/**
  * useTransactQuery
  **/
import { useMemo } from 'react';
import { RootQueryBuilder } from '@futureverse/transact';
import { useAuth } from '@futureverse/auth-react';
import { useTrnApi } from '@futureverse/transact-react';

export function useTransactQuery() {
  const { trnApi } = useTrnApi();
  const { userSession } = useAuth();
  const walletAddress = userSession?.eoa;

  const transactQuery = useMemo(() => {
    if (!trnApi || !walletAddress) {
      return;
    }
    return new RootQueryBuilder(trnApi, walletAddress);
  }, [trnApi, walletAddress]);

  return transactQuery;
}

/**
  * useShouldShowEoa
  **/
import { useAuth, useConnector } from '@futureverse/auth-react';
import { useMemo } from 'react';

export function useShouldShowEoa() {
  const auth = useAuth();
  const { connector } = useConnector();

  const shouldShowEoa = useMemo(() => {
    let should = false;
    if (!connector || !auth?.authMethod) {
      return should;
    }
    if (connector?.id !== 'xaman' && auth?.authMethod === 'eoa') {
      should = true;
    }
    return should;
  }, [connector, auth?.authMethod]);

  return shouldShowEoa;
}

/**
  * useRnsResolveRns
  **/
import type { FutureverseAuthClient } from '@futureverse/auth';
import { getAddressFromRns, getRnsFromAddress } from '../lib/rns';
import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';

export const useRnsResolveRns = (
  input: string,
  authClient: FutureverseAuthClient
) => {
  const currentChain: Chain = authClient.environment.chain;

  return useQuery({
    queryKey: ['rns', 'resolveRns', input],
    queryFn: async () => getAddressFromRns(input, currentChain),
    enabled:
      !!input &&
      input.endsWith('.root') &&
      (currentChain.id === 7672 || currentChain.id === 7668),
    refetchInterval: 0,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

/**
  * useRnsResolveAddress
  **/
import type { FutureverseAuthClient } from '@futureverse/auth';
import { getAddressFromRns, getRnsFromAddress } from '../lib/rns';
import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';

export const useRnsResolveAddress = (
  input: string,
  authClient: FutureverseAuthClient
) => {
  const currentChain: Chain = authClient.environment.chain;

  return useQuery({
    queryKey: ['rns', 'resolveAddress', input],
    queryFn: async () => getRnsFromAddress(input, currentChain),
    enabled:
      !!input &&
      input.startsWith('0x') &&
      (currentChain.id === 7672 || currentChain.id === 7668),
    refetchInterval: 0,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

/**
  * useGetTokens
  **/
import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';


export function useGetTokens(walletAddress: string, collectionId: number) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['tokens', walletAddress, collectionId],
    queryFn: async () => {
      if (!trnApi || !walletAddress) {
        console.log('Missing trnApi or walletAddress');
        return;
      }

      const tokens = await trnApi.rpc.nft.ownedTokens(
        collectionId,
        walletAddress,
        0,
        1000
      );

      const ownedTokens = tokens.toJSON()[2] as number[];

      return ownedTokens ?? [];
    },
    enabled: !!trnApi && !!walletAddress && !!collectionId,
    refetchInterval: 30000,
  });
}

/**
  * useGetExtrinsic
  **/
import { RootTransactionBuilder } from '@futureverse/transact';
import { useRootStore } from './useRootStore';


export function useGetExtrinsic() {
  const { setGas, setPayload, setToSign } = useRootStore(state => state);

  const getExtrinsic = async (builder: RootTransactionBuilder) => {
    const gasEstimate = await builder?.getGasFees();
    if (gasEstimate) {
      setGas(gasEstimate);
    }
    const payloads = await builder?.getPayloads();
    if (!payloads) {
      return;
    }
    setPayload(payloads);
    const { ethPayload } = payloads;
    setToSign(ethPayload.toString());
  };

  return getExtrinsic;
}


/**
  * useGetCount
  **/
import { decodeFunctionResult, encodeFunctionData } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { useTrnApi } from '@futureverse/transact-react';


export function useGetCount(TestContractAddress: any, TestContractAbi: any) {
  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();
  const { userSession } = useAuth();

  return useQuery({
    queryKey: ['contract', TestContractAddress],
    queryFn: async () => {
      if (!trnApi || !signer || !userSession) {
        console.log('Missing trnApi, signer or userSession');
        return;
      }

      const contractCall = encodeFunctionData({
        abi: TestContractAbi,
        functionName: 'getNumber',
        args: [],
      });

      const contractReturnData = await trnApi.rpc.eth.call({
        to: TestContractAddress,
        data: contractCall,
      });

      const returnData = decodeFunctionResult({
        abi: TestContractAbi,
        functionName: 'getNumber',
        data: contractReturnData.toHex(),
      });

      return (returnData as bigint).toString();
    },
    enabled: !!trnApi && !!signer && !!userSession,
    refetchInterval: 30000,
  });
}

/**
 * useGetNftPublicMint
 **/
import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';

export function useGetNftPublicMint(collectionId: number) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['public-mint', collectionId],
    queryFn: async () => {
      if (!trnApi || !collectionId) {
        console.log('Missing trnApi or collectionId');
        return;
      }

      const publicMintInfo = await trnApi.query.nft.publicMintInfo(
        collectionId
      );

      const info = publicMintInfo?.unwrap();

      return {
        enabled: info.enabled.toHuman(),
        pricingDetails: info.pricingDetails.toJSON(),
      };
    },
    enabled: !!trnApi && !!collectionId,
  });
}

/**
 * useGetSftUserTokens
 **/
import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';

export function useGetSftUserTokens(collectionId: number, walletAddress?: string) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['sft-tokens', collectionId, walletAddress],
    queryFn: async () => {
      if (!trnApi) {
        console.log('Missing trnApi or walletAddress');
        return;
      }

      const sftCollectionInfo = await trnApi.query.sft.sftCollectionInfo(
        collectionId
      );

      const info = sftCollectionInfo.unwrap();

      const collectionTokens = info.nextSerialNumber.toNumber() - 1;

      const tokenInfo = collectionTokens
        ? await Promise.all(
            Array.from([...new Array(collectionTokens)]).map(
              async (_, index) => {
                const token = await trnApi.query.sft.tokenInfo([
                  collectionId,
                  index,
                ]);
                const info = token.toHuman() as unknown as {
                  tokenName: string;
                  ownedTokens: [
                    string,
                    { freeBalance: string; reservedBalance: string }
                  ][];
                };

                const ownedTokens = walletAddress
                  ? info?.ownedTokens.find(owned => {
                      return (
                        owned[0].toLowerCase() === walletAddress.toLowerCase()
                      );
                    })
                  : null;

                return {
                  id: index,
                  tokenName: info?.tokenName,
                  reservedBalance: ownedTokens
                    ? ownedTokens?.[1].reservedBalance
                    : null,
                  freeBalance: ownedTokens
                    ? ownedTokens?.[1].freeBalance
                    : null,
                };
              }
            )
          )
        : [];

      return tokenInfo ?? null;
    },
    enabled: !!trnApi && !!collectionId,
    // refetchInterval: 30000,
  });
}


/************ Start of EVM Hooks ************/

/**
 * useEvmCollectionInfo
 */
import { useAuth } from '@futureverse/auth-react';
import { ERC721_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { parseAbi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export function useEvmCollectionInfo(contract: string) {
  const { userSession } = useAuth();
  const chainId = useChainId();

  return useReadContract({
    abi: parseAbi(ERC721_PRECOMPILE_ABI),
    address: contract as \`0x$\{string}\`,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!userSession && chainId === userSession.chainId && !!contract,
    },
  });
}

/**
 * useEvmCollectionInfoSft
 */
import { useAuth } from '@futureverse/auth-react';
import { ERC1155_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { parseAbi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export function useEvmCollectionInfoSft(contract: string) {
  const { userSession } = useAuth();
  const chainId = useChainId();

  return useReadContract({
    abi: parseAbi(ERC1155_PRECOMPILE_ABI),
    address: contract as \`0x$\{string}\`,
    functionName: 'owner',
    args: [],
    query: {
      enabled: !!userSession && chainId === userSession.chainId && !!contract,
    },
  });
}

/**
 * useEvmFeeProxy
 */
import { useMutation } from '@tanstack/react-query';
import type { Abi, Account, Address, ContractFunctionArgs } from 'viem';
import { writeContract } from '@wagmi/core';
import { simulateFeeProxy } from '../lib/utils';
import type { Config } from 'wagmi';

type IEvmFeeProxy = {
  config: Config;
  chainId: number;
  account: Account | Address;
  abi: Abi;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
  gasToken: number;
  slippage: string;
};

const evmFeeProxy = async ({
  config,
  account,
  chainId,
  abi,
  functionName,
  address,
  args,
  gasToken,
  slippage,
}: IEvmFeeProxy) => {
  const { request } = await simulateFeeProxy({
    config,
    // account: account,
    account,
    chainId: chainId as number,
    abi,
    functionName,
    address,
    args,
    gasToken,
    slippage,
  });

  return writeContract(config, request);
};

export function useEvmFeeProxy() {
  return useMutation({ mutationFn: evmFeeProxy });
}


/**
 * useEvmFeeProxyGas
 **/
import { useCallback } from 'react';
import { Address, getAddress, parseAbi } from 'viem';
import { estimateFeesPerGas, estimateGas, readContract } from '@wagmi/core';
import { useConfig } from 'wagmi';
import {
  assetIdToERC20Address,
  DEX_PRECOMPILE_ABI,
  DEX_PRECOMPILE_ADDRESS,
} from '@therootnetwork/evm';
import { ASSET_ID } from '../lib/utils';

export function useEvmFeeProxyGas({
  data,
  address,
  gasToken,
  slippage,
}: {
  data: \`0x$\{string}\`;
  address: Address;
  gasToken: number;
  slippage: string;
}) {
  const config = useConfig();

  const getGas = useCallback(async () => {
    if (!config) {
      throw new Error('Config is required');
    }
    if (gasToken === 2) {
      return null;
    }

    const gasEstimate = await estimateGas(config, {
      data,
      to: address,
      maxFeePerGas: 0n,
    });

    const feeData = await estimateFeesPerGas(config);

    const gasCostInEth =
      gasEstimate *
      BigInt(
        Math.floor(
          parseInt(feeData.maxFeePerGas.toString()) *
            (1 + Number(slippage) / 100)
        )
      );
    const remainder = gasCostInEth % 10n ** 12n;
    const gasCostInXrp = gasCostInEth / 10n ** 12n + (remainder > 0 ? 1n : 0n);

    const [maxPayment] = (await readContract(config, {
      address: getAddress(DEX_PRECOMPILE_ADDRESS),
      abi: parseAbi(DEX_PRECOMPILE_ABI),
      functionName: 'getAmountsIn',
      args: [
        gasCostInXrp,
        [
          assetIdToERC20Address(gasToken) as Address,
          assetIdToERC20Address(ASSET_ID.XRP) as Address,
        ],
      ],
    })) as [bigint];

    return { gasCostInXrp, token: gasToken, gasCostInToken: maxPayment };
  }, [address, config, data, gasToken, slippage]);

  return { getGas };
}


/**
 * useEvmFuturePassProxy
 **/
import { useMutation } from '@tanstack/react-query';
import { simulateFuturePassProxy } from '../lib/utils';
import {
  type Abi,
  type Account,
  type Address,
  type ContractFunctionArgs,
} from 'viem';
import { writeContract } from '@wagmi/core';
import { type Config } from 'wagmi';

type IEvmFuturePassProxy = {
  config: Config;
  account: Account | Address;
  futurePass: Address;
  abi: Abi;
  chainId: number;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
};

const evmFuturePassProxy = async ({
  config,
  account,
  futurePass,
  abi,
  chainId,
  functionName,
  address,
  args,
}: IEvmFuturePassProxy) => {
  const { request } = await simulateFuturePassProxy({
    config,
    account,
    futurePass,
    abi,
    chainId,
    functionName,
    address,
    args,
  });

  return writeContract(config, request);
};

export function useEvmFuturePassProxy() {
  return useMutation({ mutationFn: evmFuturePassProxy });
}

/**
 * useEvmFuturePassProxyGas
 **/
import { useAuth } from '@futureverse/auth-react';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { useMemo } from 'react';
import { encodeFunctionData, parseAbi } from 'viem';
import { useEstimateGas } from 'wagmi';

export function useEvmFuturePassProxyGas({
  contract,
  data,
  enabled,
}: {
  contract: string;
  data: string;
  enabled: boolean;
}) {
  const { userSession } = useAuth();

  const fpassEvmData = useMemo(() => {
    return encodeFunctionData({
      abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
      functionName: 'proxyCall',
      args: [1, contract, 0n, data],
    });
  }, [contract, data]);

  return useEstimateGas({
    chainId: userSession?.chainId,
    account: userSession?.eoa as \`0x$\{string}\`,
    to: userSession?.futurepass as \`0x$\{string}\`,
    data: fpassEvmData,
    query: {
      enabled,
    },
  });
}

/**
 * useEvmGetBalance
 **/
import { useAuth } from '@futureverse/auth-react';
import { ERC20_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { parseAbi } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

export function useEvmGetBalance(contract: string, type: string) {
  const { userSession } = useAuth();
  const chainId = useChainId();

  return useReadContract({
    abi: parseAbi(ERC20_PRECOMPILE_ABI),
    address: contract as \`0x$\{string}\`,
    functionName: 'balanceOf',
    args: [type === 'eoa' ? userSession?.eoa : userSession?.futurepass],
    query: {
      enabled: !!userSession && chainId === userSession.chainId && !!contract,
    },
  });
}

/**
 * useEvmGetDecimals
 **/
import { useAuth } from '@futureverse/auth-react';
import { ERC20_PRECOMPILE_ABI } from '@therootnetwork/evm';
import { Address, parseAbi } from 'viem';
import { useReadContract } from 'wagmi';

export function useEvmGetDecimals(contract: Address) {
  const { userSession } = useAuth();
  return useReadContract({
    address: contract,
    chainId: userSession?.chainId,
    abi: parseAbi(ERC20_PRECOMPILE_ABI),
    functionName: 'decimals',
  });
}

/**
 * useEvmGetGasPrice
 **/
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';

export function useEvmGetGasPrice({
  gasFeePerGas,
  gasEstimate,
}: {
  gasFeePerGas: string;
  gasEstimate: string;
}) {
  const publicClient = usePublicClient();

  const getGasPrice = async ({
    gasFeePerGas,
    gasEstimate,
  }: {
    gasFeePerGas: bigint;
    gasEstimate: bigint;
  }) => {
    if (!gasFeePerGas || !gasEstimate) {
      console.log('Error getting gas estimate');
      return;
    }

    const gasPrice = await publicClient?.getGasPrice();

    if (!gasPrice) {
      console.log('Error getting gas price');
      return;
    }

    const gasCostInEth = gasEstimate * gasPrice;
    const remainder = gasCostInEth % 10n ** 12n;
    const gasCostInXrp = gasCostInEth / 10n ** 12n + (remainder > 0 ? 1n : 0n);

    return formatUnits(gasCostInXrp, 6);
  };

  return useQuery({
    queryKey: ['gasPrice', gasFeePerGas, gasEstimate],
    queryFn: async () =>
      getGasPrice({
        gasFeePerGas: BigInt(gasFeePerGas),
        gasEstimate: BigInt(gasEstimate),
      }),
    enabled:
      !!gasFeePerGas &&
      !!gasEstimate &&
      gasFeePerGas !== '0' &&
      gasEstimate !== '0',
  });
}

/**
 * useEvmSimulateTx
 **/
import {
  Abi,
  Address,
  ContractConstructorArgs,
  encodeFunctionData,
  parseAbi,
} from 'viem';
import { useAccount, useConfig, useSimulateContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { simulateFeeProxy } from '../lib/utils';
import { useEffect, useState } from 'react';
import { useAuth } from '@futureverse/auth-react';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';

export function useEvmSimulateTx({
  fromWallet,
  account,
  address,
  abi,
  functionName,
  args,
  feeAssetId = 2,
  slippage,
}: {
  fromWallet: 'eoa' | 'fpass';
  account: Address;
  address: Address;
  abi: Abi;
  functionName: string;
  args: ContractConstructorArgs;
  feeAssetId: number;
  slippage: string;
}) {
  const { userSession } = useAuth();
  const { chainId } = useAccount();
  const config = useConfig();

  const {
    data: eoaData,
    isError: isEoaSimulateError,
    error: simulateEoaError,
    isPending: simulateEoaPending,
    isLoading: eoaIsLoading,
    refetch: fetchEoa,
  } = useSimulateContract({
    abi,
    account,
    address,
    functionName,
    args,
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      enabled: false,
      initialData: undefined,
    },
  });

  const {
    data: fpassData,
    isError: isFpassSimulateError,
    error: simulateFpassError,
    isPending: simulateFpassPending,
    isLoading: fpassIsLoading,
    refetch: fetchFpass,
  } = useSimulateContract({
    abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
    account: userSession?.eoa as Address,
    address: userSession?.futurepass as Address,
    functionName: 'proxyCall',
    args: [1, address, 0n, encodeFunctionData({ abi, functionName, args })],
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      enabled: false,
      initialData: undefined,
    },
  });

  const {
    data: feeProxyData,
    isError: isFeeProxySimulateError,
    error: simulateFeeProxyError,
    isPending: simulateFeeProxyPending,
    isLoading: feeProxyIsLoading,
    refetch: fetchFeeProxy,
  } = useQuery({
    queryKey: ['simulateFuturePassProxy', { address, abi, functionName }],
    queryFn: async () => {
      return await simulateFeeProxy({
        config,
        account,
        chainId: chainId as number,
        abi,
        functionName,
        address,
        args,
        gasToken: feeAssetId,
        slippage,
      });
    },
    enabled: false,
    initialData: undefined,
  });

  const [eoaIsLoaded, setEoaIsLoaded] = useState(false);
  const [feeProxyIsLoaded, setFeeProxyIsLoaded] = useState(false);
  const [fpassIsLoaded, setFpassIsLoaded] = useState(false);

  useEffect(() => {
    if (eoaIsLoading && !eoaIsLoaded) {
      setEoaIsLoaded(true);
    }
    if (fpassIsLoading && !fpassIsLoaded) {
      setFpassIsLoaded(true);
    }
    if (feeProxyIsLoading && !feeProxyIsLoaded) {
      setFeeProxyIsLoaded(true);
    }
  }, [
    eoaIsLoaded,
    fpassIsLoaded,
    feeProxyIsLoaded,
    eoaIsLoading,
    fpassIsLoading,
    feeProxyIsLoading,
  ]);

  useEffect(() => {
    if (fromWallet === 'eoa' && feeAssetId === 2 && !eoaIsLoaded) {
      fetchEoa();
    }
    if (fromWallet === 'fpass' && !fpassIsLoaded) {
      fetchFpass();
    }
    if (fromWallet === 'eoa' && feeAssetId !== 2 && !feeProxyIsLoaded) {
      fetchFeeProxy();
    }
  }, [
    fromWallet,
    feeAssetId,
    fetchEoa,
    fetchFpass,
    fetchFeeProxy,
    eoaIsLoaded,
    fpassIsLoaded,
    feeProxyIsLoaded,
  ]);

  const request =
    fromWallet === 'eoa' && feeAssetId === 2
      ? eoaData?.request
      : fromWallet === 'eoa' && feeAssetId !== 2
      ? feeProxyData?.request
      : fpassData?.request;

  const isError =
    isEoaSimulateError || isFpassSimulateError || isFeeProxySimulateError;
  const error = simulateEoaError || simulateFpassError || simulateFeeProxyError;
  const isPending =
    (simulateEoaPending && eoaIsLoaded) ||
    (simulateFpassPending && fpassIsLoaded) ||
    (simulateFeeProxyPending && feeProxyIsLoaded);

  console.log('request', request);
  console.log('eoaData', eoaData);
  console.log('feeProxyData', feeProxyData);
  console.log('fpassData', fpassData);

  return {
    request,
    isError,
    error: error && (error as unknown as { shortMessage: string }).shortMessage,
    isPending,
  };
}

/**
 * useEvmTx
 **/
import { useCallback } from 'react';
import { useAccount, useConfig, useWriteContract } from 'wagmi';
//import { useEvmFuturePassProxy } from './useEvmFuturePassProxy';
import { useEvmFeeProxy } from './useEvmFeeProxy';
import {
  Abi,
  Account,
  Address,
  ContractFunctionArgs,
  encodeFunctionData,
  parseAbi,
} from 'viem';
import { useAuth } from '@futureverse/auth-react';
import { FUTUREPASS_PRECOMPILE_ABI } from '@therootnetwork/evm';

export function useEvmTx() {
  const { userSession } = useAuth();
  const { chain } = useAccount();
  const config = useConfig();

  const {
    data: evmHash,
    writeContract: evmWrite,
    isPending: evmPending,
    isSuccess: evmSuccess,
    isError: evmIsError,
    error: evmError,
  } = useWriteContract();

  const {
    data: futurePassHash,
    writeContract: futurePassProxyWrite,
    isPending: futurePassPending,
    isSuccess: futurePassSuccess,
    isError: futurePassIsError,
    error: futurePassError,
  } = useWriteContract();

  const {
    data: feeProxyHash,
    mutate: feeProxyWrite,
    isSuccess: feeProxySuccess,
    isPending: feeProxyPending,
    isError: feeProxyIsError,
    error: feeProxyError,
  } = useEvmFeeProxy();

  const hash = evmHash || futurePassHash || feeProxyHash;
  const isPending = evmPending || futurePassPending || feeProxyPending;
  const isSuccess = evmSuccess || futurePassSuccess || feeProxySuccess;
  const isError = evmIsError || futurePassIsError || feeProxyIsError;
  const error = evmError || futurePassError || feeProxyError;

  const chainId = (chain?.id ?? userSession?.chainId) as number;

  const submitTx = useCallback(
    async ({
      account,
      address,
      abi,
      functionName,
      args,
      fromWallet,
      gasToken,
      slippage,
    }: {
      account: Account | Address;
      address: Address;
      abi: Abi;
      functionName: string;
      args: ContractFunctionArgs;
      fromWallet: string;
      gasToken: number;
      slippage: string;
    }) => {
      if (!account) {
        throw new Error('Account is required');
      }
      if (!address) {
        throw new Error('Address is required');
      }

      if (fromWallet === 'fpass' && gasToken === 2) {
        const futurePassCall = encodeFunctionData({
          abi,
          functionName,
          args,
        });

        return futurePassProxyWrite({
          account,
          address: userSession?.futurepass as Address,
          chainId,
          abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
          functionName: 'proxyCall',
          args: [1, address, 0n, futurePassCall],
        });
      }

      if (fromWallet === 'eoa' && gasToken !== 2) {
        return feeProxyWrite({
          config,
          account,
          chainId,
          abi,
          address,
          functionName,
          args,
          gasToken,
          slippage,
        });
      }

      return await evmWrite({
        account,
        abi,
        address,
        functionName,
        args,
      });
    },
    [
      evmWrite,
      futurePassProxyWrite,
      config,
      userSession?.futurepass,
      chainId,
      feeProxyWrite,
    ]
  );

  return { submitTx, hash, isPending, isError, error, isSuccess };
}

/************ End of EVM Hooks ************/

`;
