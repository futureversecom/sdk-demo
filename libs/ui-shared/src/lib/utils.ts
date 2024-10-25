import { RootQueryBuilder } from '@futureverse/transact';
import {
  assetIdToERC20Address,
  DEX_PRECOMPILE_ABI,
  DEX_PRECOMPILE_ADDRESS,
  FEE_PROXY_PRECOMPILE_ABI,
  FEE_PROXY_PRECOMPILE_ADDRESS,
  FUTUREPASS_PRECOMPILE_ABI,
  FUTUREPASS_REGISTRAR_PRECOMPILE_ABI,
  FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS,
} from '@therootnetwork/evm';
import {
  Abi,
  Account,
  Address,
  ContractFunctionArgs,
  encodeFunctionData,
  formatUnits,
  getAddress,
  parseAbi,
} from 'viem';
// import { readContract } from 'viem/actions';
import {
  estimateFeesPerGas,
  estimateGas,
  readContract,
  simulateContract,
} from '@wagmi/core';
import { Config } from 'wagmi';

export const ALLOWED_CHAINS = [7668, 7672];

export const ASSET_ID: Record<string, number> = {
  ROOT: 1,
  XRP: 2,
  SYLO: 3172,
  ASTO: 17508,
} as const;

export const ASSET_NAME: Record<number, string> = {
  1: 'ROOT',
  2: 'XRP',
  3172: 'SYLO',
  17508: 'ASTO',
} as const;

export const assetIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xcccccccc${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const nftCollectionIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xaaaaaaaa${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const sftCollectionIdToAddress = (collectionId: number) => {
  const address = getAddress(
    `0xaaaaaaaa${(+collectionId)
      .toString(16)
      .padStart(8, '0')}000000000000000000000000`
  );
  return address;
};

export const erc20AddressToAssetId = (address: `0x${string}`) => {
  const collectionIdHex = address.slice(10, 18);
  const collectionId = parseInt(collectionIdHex, 16);
  return collectionId;
};
export const erc721AddressToCollectionId = (address: `0x${string}`) => {
  return erc20AddressToAssetId(address);
};
export const erc1155AddressToCollectionId = (address: `0x${string}`) => {
  return erc20AddressToAssetId(address);
};

export const shortAddress = (address: string, start = 6, end = 4) => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getBalance = async (
  transactionQuery: RootQueryBuilder | undefined,
  address: string,
  assetId: number
) => {
  if (!transactionQuery) {
    return {
      balance: '0',
      rawBalance: '0',
      decimals: 0,
    };
  }

  const walletBalance = await transactionQuery?.checkBalance({
    walletAddress: address,
    assetId: assetId,
  });

  return {
    balance: walletBalance
      ? formatUnits(BigInt(walletBalance?.balance), walletBalance?.decimals)
      : '0',
    rawBalance: walletBalance?.balance,
    decimals: walletBalance?.decimals,
  };
};

export const getBalances = async (
  transactionQuery: RootQueryBuilder | undefined,
  walletAssetIds: Array<{ walletAddress: string; assetId: number }>
) => {
  if (!transactionQuery) {
    return [
      {
        walletAddress: '',
        balance: '0',
        rawBalance: '0',
        decimals: 0,
      },
    ];
  }

  const walletBalances = await transactionQuery?.checkBalances(walletAssetIds);

  const balances = walletBalances?.map(walletBalance => {
    return {
      walletAddress: walletBalance.walletAddress,
      balance: formatUnits(
        BigInt(walletBalance?.balance),
        walletBalance?.decimals
      ),
      rawBalance: walletBalance?.balance,
      decimals: walletBalance?.decimals,
    };
  });

  return balances;
};

export const getFuturePass = async (
  config: Config,
  address: Account | Address
): Promise<Address> => {
  return (await readContract(config, {
    address: getAddress(FUTUREPASS_REGISTRAR_PRECOMPILE_ADDRESS),
    abi: parseAbi(FUTUREPASS_REGISTRAR_PRECOMPILE_ABI),
    functionName: 'futurepassOf',
    args: [address],
  })) as Address;
};

export const simulateFuturePassProxy = async ({
  config,
  account,
  futurePass,
  abi,
  chainId,
  functionName,
  address,
  args,
}: {
  config: Config;
  account: Account | Address;
  futurePass: Address;
  abi: Abi;
  chainId: number;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
}) => {
  if (!config) throw new Error('Client is required');
  if (!account) throw new Error('Account is required');
  if (!abi) throw new Error('ABI is required');
  if (!functionName) throw new Error('Function name is required');
  if (!address) throw new Error('Address is required');

  if (!ALLOWED_CHAINS.includes(chainId))
    throw new Error(
      'Invalid chain. Please use either Root Network or Porcini.'
    );

  // const futurePass = await getFuturePass(config, account);

  console.log('futurePass', futurePass);
  console.log('abi', abi);
  console.log('chainId', chainId);
  console.log('functionName', functionName);
  console.log('address', address);
  console.log('args', args);

  const futurePassCall = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  console.log('futurePassCall', futurePassCall);

  console.log('fpass', {
    account,
    address: futurePass,
    abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
    chainId,
    functionName: 'proxyCall',
    args: [1, address, 0n, futurePassCall],
  });

  return await simulateContract(config, {
    account,
    address: futurePass,
    abi: parseAbi(FUTUREPASS_PRECOMPILE_ABI),
    chainId,
    functionName: 'proxyCall',
    args: [1, address, 0n, futurePassCall],
  });
};

export const simulateFeeProxy = async ({
  config,
  account,
  chainId,
  abi,
  functionName,
  address,
  args,
  gasToken,
  slippage,
}: {
  config: Config;
  chainId: number;
  account: Account | Address;
  abi: Abi;
  functionName: string;
  address: Address;
  args: ContractFunctionArgs;
  gasToken: number;
  slippage: string;
}) => {
  if (!chainId) throw new Error('Chain is required');
  if (!config) throw new Error('Client is required');
  if (!account) throw new Error('Account is required');
  if (!abi) throw new Error('ABI is required');
  if (!functionName) throw new Error('Function name is required');
  if (!address) throw new Error('Address is required');

  if (!ALLOWED_CHAINS.includes(chainId))
    throw new Error(
      'Invalid chain. Please use either Root Network or Porcini.'
    );

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  const gasEstimate = await estimateGas(config, { data, to: address });

  const feeData = await estimateFeesPerGas(config);

  const gasCostInEth =
    gasEstimate *
    BigInt(
      Math.floor(
        parseInt(feeData.maxFeePerGas.toString()) * (1 + Number(slippage) / 100)
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

  return await simulateContract(config, {
    account,
    chainId,
    gas: gasEstimate,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: 0n,
    address: getAddress(FEE_PROXY_PRECOMPILE_ADDRESS),
    abi: parseAbi(FEE_PROXY_PRECOMPILE_ABI),
    functionName: 'callWithFeePreferences',
    args: [
      assetIdToERC20Address(gasToken) as Address,
      maxPayment,
      address,
      data,
    ],
  });
};

export const buttonDisable = () => {
  console.log('buttonDisable being called');
  const buttons = document.querySelectorAll(
    '.sdk-ui-demo .fvaui-button-web3auth, .sdk-ui-demo .fvaui-custodialauthbutton, .sdk-ui-demo .fvaui-custodialauthoptions-social button'
  );
  console.log('buttons', buttons);

  buttons.forEach(button => {
    button.setAttribute('disabled', 'true');
  });
};

export const disableAuthLoginButtons = () => {
  document.addEventListener('click', buttonDisable);

  setTimeout(() => {
    buttonDisable();
  }, 250);
};
