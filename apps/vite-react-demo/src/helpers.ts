import { NetworkName } from '@therootnetwork/api';

export const NETWORK_PROVIDER: Record<
  NetworkName,
  { ws: `ws${string}`; http: `http${string}` }
> = {
  root: {
    ws: 'wss://root.rootnet.live/ws',
    http: 'https://root.rootnet.live',
  },
  porcini: {
    ws: 'wss://porcini.rootnet.app/ws',
    http: 'https://porcini.rootnet.app',
  },
  'sprout-1': {
    ws: 'wss://porcini.devnet.rootnet.app/ws',
    http: 'https://porcini.devnet.rootnet.app',
  },
  'sprout-2': {
    ws: 'wss://porcini.devnet.rootnet.app/ws',
    http: 'https://porcini.devnet.rootnet.app',
  },
};

export const ASSET_DECIMALS: Record<number, number> = {
  1: 6,
  2: 6,
  3172: 18,
  17508: 18,
};
