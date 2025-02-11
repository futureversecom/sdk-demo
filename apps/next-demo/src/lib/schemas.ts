import { z } from 'zod';
import { getAddress } from 'viem';

export const meResponseSchema = z.object({
  sub: z.string(),
  eoa: z.string().transform(async arg => getAddress(arg)),
  custodian: z.string(),
  chainId: z.number(),
  futurepass: z.string().transform(async arg => getAddress(arg)),
});
