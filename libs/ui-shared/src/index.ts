import { ASSET_DECIMALS, NETWORK_PROVIDER } from './helpers';
import { TrnApiProvider, useTrnApi, RootStoreProvider } from './providers';
import {
  AssetFromEoa,
  AssetFromEoaFeeProxy,
  AssetFromFuturePass,
  AssetFromFuturePassFeeProxy,
  Home,
  Result,
  TransactionDetails,
  Transfer,
  Custom,
  CustomBuilder,
  CustomBuilderComp,
  CustomExtrinsic,
  Spinner,
  Evm,
  Nft,
  AssetTransfer,
  Assets,
  Header,
  Navigation,
  DropDownMenu,
  type MenuProps,
  LogOut,
  Footer,
} from './components';
import { useIsMounted, useIsMobile } from './hooks';

import { collectionIdToAddress } from './lib/utils';
import { TestContractAddress, TestContractAbi } from './lib/test-contract';

export {
  Evm,
  ASSET_DECIMALS,
  NETWORK_PROVIDER,
  TrnApiProvider,
  useTrnApi,
  RootStoreProvider,
  AssetFromEoa,
  AssetFromEoaFeeProxy,
  AssetFromFuturePass,
  AssetFromFuturePassFeeProxy,
  Home,
  Result,
  TransactionDetails,
  Transfer,
  useIsMounted,
  useIsMobile,
  Spinner,
  collectionIdToAddress,
  TestContractAddress,
  TestContractAbi,
  Custom,
  CustomBuilder,
  CustomBuilderComp,
  CustomExtrinsic,
  Nft,
  AssetTransfer,
  Assets,
  Header,
  Footer,
  Navigation,
  DropDownMenu,
  LogOut,
};

export type { MenuProps };
