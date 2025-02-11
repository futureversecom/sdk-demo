'use client';

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
    // refetchInterval: 30000,
  });
}
