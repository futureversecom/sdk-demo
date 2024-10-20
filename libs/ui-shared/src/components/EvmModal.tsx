import { useEffect, useMemo, useState } from 'react';

import {
  Abi,
  Address,
  ContractConstructorArgs,
  encodeFunctionData,
  formatUnits,
  getAddress,
} from 'viem';
import { Dialog } from './Dialog/Dialog';
import CodeView from './CodeView';
import {
  useEvmFeeProxyGas,
  useEvmFuturePassProxyGas,
  useEvmGetDecimals,
  useEvmGetGasPrice,
  useEvmTx,
} from '../hooks';
import {
  useAccount,
  useEstimateFeesPerGas,
  useEstimateGas,
  useSimulateContract,
  useTransactionReceipt,
} from 'wagmi';
import { ExternalLink } from './Icons';
import { useAuth } from '@futureverse/auth-react';
import { ASSET_NAME } from '../lib/utils';
import Spinner from './Spinner';
import { assetIdToERC20Address } from '@therootnetwork/evm';

const codeString = ``;

export function EvmModal({
  setShowDialog,
  fromWallet,
  contract,
  abi,
  functionName,
  args,
  decimals,
  feeAssetId,
  slippage,
  callback,
}: {
  setShowDialog: (value: boolean) => void;
  fromWallet: 'eoa' | 'fpass';
  contract: Address;
  abi: Abi;
  functionName: string;
  args: ContractConstructorArgs;
  decimals?: number;
  feeAssetId: number;
  slippage: string;
  callback?: () => void;
}) {
  const { userSession } = useAuth();
  const { chainId } = useAccount();

  const { data: feeDecimals } = useEvmGetDecimals(
    assetIdToERC20Address(feeAssetId) as Address
  );

  const {
    isError: isSimulateError,
    error: simulateError,
    isPending: simulatePending,
  } = useSimulateContract({
    abi,
    address: contract,
    functionName,
    args,
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      enabled:
        !!userSession &&
        chainId === userSession.chainId &&
        !!contract &&
        !!abi &&
        !!functionName &&
        !!args,
    },
  });

  const {
    hash: evmHash,
    submitTx,
    isPending: evmPending,
    isError: evmIsError,
    error: evmError,
  } = useEvmTx();

  const { data: txRcpt, isFetching: txRcptFinalising } = useTransactionReceipt({
    hash: evmHash,
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const evmData = useMemo(() => {
    return encodeFunctionData({
      abi,
      functionName,
      args,
    });
  }, [abi, args, functionName]);

  const { data: gasEstimate } = useEstimateGas({
    chainId: userSession?.chainId,
    account: userSession?.eoa as `0x${string}`,
    to: contract,
    data: evmData,
    query: {
      enabled:
        !!userSession &&
        chainId === userSession.chainId &&
        !!contract &&
        !isSimulateError,
    },
  });

  const { data: fPassGasEstimate } = useEvmFuturePassProxyGas({
    contract: contract,
    data: evmData,
    enabled:
      !!userSession &&
      chainId === userSession.chainId &&
      !!contract &&
      !!evmData &&
      fromWallet === 'fpass' &&
      !isSimulateError,
  });

  const { getGas } = useEvmFeeProxyGas({
    address: contract,
    data: evmData,
    gasToken: feeAssetId,
    slippage,
  });

  const evmGasEstimate =
    fromWallet === 'eoa'
      ? feeAssetId === 2
        ? gasEstimate
        : undefined
      : fPassGasEstimate;

  const { data: gasFeePerGas } = useEstimateFeesPerGas({
    formatUnits: 'ether',
  });

  const { data: gasPrice } = useEvmGetGasPrice({
    gasEstimate: evmGasEstimate?.toString() ?? '0',
    gasFeePerGas: gasFeePerGas?.maxFeePerGas.toString() ?? '0',
  });

  const [gasPriceState, setGasPriceState] = useState<string | undefined>(
    gasPrice
  );
  const [gasPriceTokenState, setGasPriceTokenState] = useState<
    string | undefined
  >();

  useEffect(() => {
    (async () => {
      const gasPriceFromFeeProxy = await getGas();

      feeAssetId !== 2 &&
        setGasPriceTokenState(
          Number(
            formatUnits(
              gasPriceFromFeeProxy?.gasCostInToken ?? 0n,
              feeDecimals as number
            ).toString()
          )
            .toFixed(6)
            .toString()
        );

      feeAssetId !== 2 &&
        setGasPriceState(
          formatUnits(gasPriceFromFeeProxy?.gasCostInXrp ?? 0n, 6)
        );
    })();
    if (gasPrice) {
      setGasPriceState(gasPrice);
    }
  }, [decimals, feeAssetId, feeDecimals, gasPrice, getGas]);

  const submitTransfer = async () => {
    return submitTx({
      fromWallet,
      account: getAddress(userSession?.eoa as `0x${string}`),
      abi,
      address: contract as `0x${string}`,
      functionName,
      args,
      gasToken: feeAssetId,
      slippage,
    });
  };

  useEffect(() => {
    if (txRcpt?.status === 'success') {
      callback && callback();
    }
  }, [callback, txRcpt]);

  return (
    <Dialog>
      <Dialog.Container>
        <Dialog.Content>
          <div className="card">
            <div className="inner">
              {!txRcptFinalising && (
                <button
                  className="dialog-close green"
                  onClick={() => setShowDialog(false)}
                >
                  X
                </button>
              )}

              {!txRcptFinalising && !txRcpt && !evmPending && (
                <>
                  {simulatePending && (
                    <CodeView code={codeString}>
                      <h1>Simulating Transaction</h1>
                    </CodeView>
                  )}

                  {!simulatePending && !isSimulateError && (
                    <CodeView code={codeString}>
                      <h1>Confirm Transaction</h1>
                    </CodeView>
                  )}

                  {!simulatePending && isSimulateError && (
                    <CodeView code={codeString}>
                      <h1>Transaction Will Fail</h1>
                    </CodeView>
                  )}

                  {gasPriceState && (
                    <div className="row content-row gas-row">
                      <div className="title">Gas Price</div>
                      <div className="content">{gasPriceState} XRP</div>
                    </div>
                  )}

                  {gasPriceTokenState && (
                    <div className="row content-row gas-row">
                      <div className="title">Token Gas Price</div>
                      <div className="content">
                        {gasPriceTokenState} {ASSET_NAME[feeAssetId]}
                      </div>
                    </div>
                  )}

                  {simulatePending && (
                    <div className="row content-row gas-row">
                      <div>
                        <Spinner /> Simulating...
                      </div>
                    </div>
                  )}

                  {isSimulateError && (
                    <div className="row content-row gas-row">
                      <div>
                        {
                          (simulateError as { shortMessage: string })
                            .shortMessage
                        }
                      </div>
                    </div>
                  )}

                  <button
                    className="builder-input green"
                    onClick={submitTransfer}
                    disabled={evmPending || isSimulateError || simulatePending}
                  >
                    Submit Transaction
                  </button>
                </>
              )}

              {evmPending && (
                <div className="row content-row gas-row">
                  <div className="grid cols-1">
                    <div
                      className="spinner"
                      style={{
                        margin: '0 auto',
                        marginTop: '16px',
                        width: '100px',
                        height: '100px',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      Waiting For Signature...
                    </div>
                  </div>
                </div>
              )}

              {txRcptFinalising && txRcpt?.status !== 'success' && (
                <div className="row gas-row">
                  <div className="grid cols-1">
                    <div
                      className="spinner"
                      style={{
                        margin: '0 auto',
                        marginTop: '16px',
                        width: '100px',
                        height: '100px',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      Waiting For Tx To Finalise...
                    </div>
                  </div>
                </div>
              )}
              {!txRcptFinalising && evmHash && !!txRcpt?.status && (
                <div className="row gas-row">
                  <CodeView code={codeString}>
                    <h1>
                      Transaction{' '}
                      {txRcpt.status === 'success' ? 'Succeeded' : 'Failed'}
                    </h1>
                  </CodeView>
                  <div>
                    <a
                      href={`https://porcini.rootscan.io/tx/${evmHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View TX on Rootscan{' '}
                      <ExternalLink
                        styles={{
                          width: '16px',
                          height: '16px',
                          display: 'inline-block',
                        }}
                      />
                    </a>
                  </div>
                </div>
              )}
              {evmHash && !!txRcpt?.status && evmIsError && (
                <div className="row gas-row">
                  <div className="title">Error</div>
                  <div className="content">{evmError?.message}</div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Container>
    </Dialog>
  );
}
