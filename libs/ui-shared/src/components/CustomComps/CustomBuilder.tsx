'use client';
import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';

import { useFutureverseSigner } from '@futureverse/auth-react';

import { useRootStore } from '../../hooks/useRootStore';
import { useCustomExtrinsicBuilder } from '../../hooks/useCustomExtrinsicBuilder';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';
import { isAddress } from 'viem';
import SliderInput from '../SliderInput';
import { useShouldShowEoa } from '../../hooks';

const codeString = `
import { useAuth } from '@futureverse/auth-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrnApi } from '@futureverse/transact-react';

import { useFutureverseSigner } from '@futureverse/auth-react';

import { useRootStore } from '../../hooks/useRootStore';
import { useCustomExtrinsicBuilder } from '../../hooks/useCustomExtrinsicBuilder';

import { useGetExtrinsic } from '../../hooks/useGetExtrinsic';
import CodeView from '../CodeView';
import { isAddress } from 'viem';
import SliderInput from '../SliderInput';
import { useShouldShowEoa } from '../../hooks';


type Argument = {
  name: string;
  type: string;
  defaultValue: string | number | boolean;
  validation?: 'address' | 'number' | 'string' | 'boolean';
};

type Method = {
  args: Array<Argument>;
};

type Pallet = {
  [key: string]: Method;
};

type CustomPalletMethods = {
  [key: string]: Pallet;
};

export default function CustomBuilderComp() {
  const { userSession } = useAuth();
  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();
  const shouldShowEoa = useShouldShowEoa();

  const builder = useCustomExtrinsicBuilder({
    trnApi,
    walletAddress: userSession?.eoa ?? '',
    signer,
  });

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const customPalletMethods: CustomPalletMethods = useMemo(() => {
    return {
      assetsExt: {
        transfer: {
          args: [
            {
              name: 'assetId',
              type: 'number',
              defaultValue: '1',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: shouldShowEoa ? userSession?.eoa ?? '' : '',
              validation: 'address',
            },
            {
              name: 'amount',
              type: 'number',
              defaultValue: '1000000',
            },
            {
              name: 'keepAlive',
              type: 'boolean',
              defaultValue: true,
            },
          ],
        },
      },
      nft: {
        mint: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 709732,
            },
            {
              name: 'quantity',
              type: 'number',
              defaultValue: '1',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        transfer: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 709732,
            },
            {
              name: 'serialNumbers',
              type: 'number[]',
              defaultValue: '1',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        burn: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 709732,
            },
            {
              name: 'serialNumber',
              type: 'number',
              defaultValue: '1',
            },
          ],
        },
      },
      sft: {
        mint: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 834660,
            },
            {
              name: 'serialNumbers',
              type: '[number, number][]',
              defaultValue: '[[1, 1]]',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        transfer: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 834660,
            },
            {
              name: 'serialNumbers',
              type: '[number, number][]',
              defaultValue: '[[1, 1]]',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        burn: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 834660,
            },
            {
              name: 'serialNumbers',
              type: '[number, number][]',
              defaultValue: '[[1, 1]]',
            },
          ],
        },
      },
      system: {
        remark: {
          args: [
            {
              name: 'remark',
              type: 'string',
              defaultValue: '1',
            },
          ],
        },
      },
    };
  }, [shouldShowEoa, userSession?.eoa, userSession?.futurepass]);

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const getExtrinsic = useGetExtrinsic();

  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [slippage, setSlippage] = useState<string>('5');

  const [useFuturePass, setUseFuturePass] = useState(true);

  const [pallet, setPallet] = useState<keyof CustomPalletMethods | null>(null);
  const [method, setMethod] = useState<keyof Method | null>(null);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (pallet && method) {
      const selectedMethod = customPalletMethods[pallet][method];
      const initialFormValues: { [key: string]: string } = {};
      selectedMethod.args.forEach(arg => {
        initialFormValues[arg.name] = String(arg.defaultValue);
      });
      setFormValues(initialFormValues);
    }
  }, [pallet, method, customPalletMethods]);

  const formatValues = (
    values: { [key: string]: string },
    args: Argument[]
  ) => {
    return args.map(arg => {
      const value = values[arg.name];
      switch (arg.type) {
        case 'number':
          return Number(value);
        case 'boolean':
          return value === 'true';
        case 'number[]':
          return value.split(',').map(Number);
        case '[number, number][]':
          return JSON.parse(value);
        default:
          return value;
      }
    });
  };

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession || !builder) {
      console.log('Missing trnApi, signer, userSession or builder');
      return;
    }

    if (!pallet || !method) {
      console.log('Missing pallet or method');
      return;
    }

    const selectedMethod = customPalletMethods[pallet][method];
    const formattedValues = formatValues(formValues, selectedMethod.args);

    const extrinsic = trnApi.tx?.[pallet]?.[method](...formattedValues);

    builder.reset();
    builder.fromExtrinsic(extrinsic);

    if (feeAssetId === 2) {
      if (useFuturePass) {
        await builder.addFuturePass(userSession.futurepass);
      }
    }
    if (feeAssetId !== 2) {
      if (useFuturePass) {
        await builder.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
      if (!useFuturePass) {
        await builder.addFeeProxy({
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    builder,
    pallet,
    method,
    customPalletMethods,
    formValues,
    feeAssetId,
    getExtrinsic,
    setCurrentBuilder,
    useFuturePass,
    slippage,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  return (
    <div className={\`card $\{disable ? 'disabled' : ''}\`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Extrinsic Builder</h3>
        </CodeView>
        <div className="row">
          <label>
            Pallet
            <select
              value={pallet ?? ''}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setMethod(null);
                setFormValues({});
                setPallet(
                  e.target.value !== ''
                    ? (e.target.value as keyof CustomPalletMethods)
                    : null
                );
              }}
            >
              <option value={''}>Select Pallet</option>
              {Object.keys(customPalletMethods).map(pallet => (
                <option key={pallet} value={pallet}>
                  {pallet}
                </option>
              ))}
            </select>
          </label>
        </div>
        {pallet && (
          <div className="row">
            <label>
              Method
              <select
                value={method ?? ''}
                className="w-full builder-input"
                disabled={disable}
                onChange={e => {
                  resetState();
                  setFormValues({});
                  setMethod(
                    e.target.value !== ''
                      ? (e.target.value as keyof Method)
                      : null
                  );
                }}
              >
                <option value={''}>Select Method</option>
                {pallet &&
                  Object.keys(customPalletMethods[pallet]).map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        )}
        {pallet && method && (
          <div style={{ marginBottom: '-8px', marginTop: '8px' }}>
            <label>Arguments</label>
          </div>
        )}
        {pallet && method && (
          <div className="row">
            {customPalletMethods[pallet][method].args.map(arg => (
              <div key={arg.name}>
                <label>
                  {arg.name} ({arg.type})
                  <input
                    type="text"
                    className="w-full builder-input"
                    disabled={disable}
                    onChange={e => {
                      if (arg.validation === 'address') {
                        if (e.target.value.length !== 42) {
                          setAddressError('Address is too long');
                        }
                        if (!isAddress(e.target.value)) {
                          setAddressError('Invalid address');
                        }
                        if (
                          isAddress(e.target.value) &&
                          e.target.value.length === 42
                        ) {
                          setAddressError(null);
                        }
                      }
                      handleInputChange(e);
                    }}
                    name={arg.name}
                    value={formValues[arg.name] ?? ''}
                  />
                  {arg.validation === 'address' && addressError && (
                    <span
                      style={{ display: 'inline-block', fontSize: '0.8rem' }}
                      className="text-red-500"
                    >
                      {addressError}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
        {pallet &&
          method &&
          formValues &&
          Object.keys(formValues).length ===
            customPalletMethods[pallet][method].args.length && (
            <div style={{ marginBottom: '-8px', marginTop: '8px' }}>
              <label>Origin Wallet & Gas Token</label>
            </div>
          )}
        {pallet &&
          method &&
          formValues &&
          Object.keys(formValues).length ===
            customPalletMethods[pallet][method].args.length && (
            <>
              <div className="row">
                <label>
                  Use FuturePass
                  <select
                    value={useFuturePass.toString()}
                    className="w-full builder-input"
                    onChange={e => {
                      resetState();
                      setUseFuturePass(
                        e.target.value === 'true' ? true : false
                      );
                    }}
                  >
                    <option value={'true'}>Use FuturePass</option>
                    {shouldShowEoa && (
                      <option value={'false'}>Do Not Use FuturePass</option>
                    )}
                  </select>
                </label>
              </div>
              <div className="row">
                <label>
                  Gas Token
                  <select
                    value={feeAssetId}
                    className="w-full builder-input"
                    disabled={disable}
                    onChange={e => {
                      resetState();
                      setFeeAssetId(Number(e.target.value));
                    }}
                  >
                    <option value={2}>XRP</option>
                    <option value={1}>ROOT</option>
                    <option value={3172}>SYLO</option>
                    <option value={17508}>ASTO</option>
                  </select>
                </label>
              </div>
              {feeAssetId !== 2 && (
                <div className="row">
                  <SliderInput
                    sliderValue={slippage}
                    setSliderValue={setSlippage}
                    minValue={0}
                    sliderStep={0.1}
                    maxValue={15}
                    resetState={resetState}
                  />
                </div>
              )}
              <div className="row">
                <button
                  className={\`w-full builder-input green $\{
                    disable || !!addressError ? 'disabled' : ''
                  }\`}
                  onClick={() => {
                    resetState();
                    createBuilder();
                  }}
                  disabled={disable || !!addressError}
                  style={{ textTransform: 'capitalize' }}
                >
                  {method} {pallet}
                </button>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
`;

type Argument = {
  name: string;
  type: string;
  defaultValue: string | number | boolean;
  validation?: 'address' | 'number' | 'string' | 'boolean';
};

type Method = {
  args: Array<Argument>;
};

type Pallet = {
  [key: string]: Method;
};

type CustomPalletMethods = {
  [key: string]: Pallet;
};

export default function CustomBuilderComp() {
  const { userSession } = useAuth();
  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();
  const shouldShowEoa = useShouldShowEoa();

  const builder = useCustomExtrinsicBuilder({
    trnApi,
    walletAddress: userSession?.eoa ?? '',
    signer,
  });

  const { resetState, setCurrentBuilder, signed, result, error } = useRootStore(
    state => state
  );

  const customPalletMethods: CustomPalletMethods = useMemo(() => {
    return {
      assetsExt: {
        transfer: {
          args: [
            {
              name: 'assetId',
              type: 'number',
              defaultValue: '1',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: shouldShowEoa ? userSession?.eoa ?? '' : '',
              validation: 'address',
            },
            {
              name: 'amount',
              type: 'number',
              defaultValue: '1000000',
            },
            {
              name: 'keepAlive',
              type: 'boolean',
              defaultValue: true,
            },
          ],
        },
      },
      nft: {
        mint: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 709732,
            },
            {
              name: 'quantity',
              type: 'number',
              defaultValue: '1',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        transfer: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 709732,
            },
            {
              name: 'serialNumbers',
              type: 'number[]',
              defaultValue: '1',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        burn: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 709732,
            },
            {
              name: 'serialNumber',
              type: 'number',
              defaultValue: '1',
            },
          ],
        },
      },
      sft: {
        mint: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 834660,
            },
            {
              name: 'serialNumbers',
              type: '[number, number][]',
              defaultValue: '[[1, 1]]',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        transfer: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 834660,
            },
            {
              name: 'serialNumbers',
              type: '[number, number][]',
              defaultValue: '[[1, 1]]',
            },
            {
              name: 'walletAddress',
              type: 'string',
              defaultValue: userSession?.futurepass ?? '',
              validation: 'address',
            },
          ],
        },
        burn: {
          args: [
            {
              name: 'collectionId',
              type: 'number',
              defaultValue: 834660,
            },
            {
              name: 'serialNumbers',
              type: '[number, number][]',
              defaultValue: '[[1, 1]]',
            },
          ],
        },
      },
      system: {
        remark: {
          args: [
            {
              name: 'remark',
              type: 'string',
              defaultValue: '1',
            },
          ],
        },
      },
    };
  }, [shouldShowEoa, userSession?.eoa, userSession?.futurepass]);

  const disable = useMemo(() => {
    return signed && !result && !error;
  }, [signed, result, error]);

  const getExtrinsic = useGetExtrinsic();

  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const [slippage, setSlippage] = useState<string>('5');

  const [useFuturePass, setUseFuturePass] = useState(true);

  const [pallet, setPallet] = useState<keyof CustomPalletMethods | null>(null);
  const [method, setMethod] = useState<keyof Method | null>(null);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (pallet && method) {
      const selectedMethod = customPalletMethods[pallet][method];
      const initialFormValues: { [key: string]: string } = {};
      selectedMethod.args.forEach(arg => {
        initialFormValues[arg.name] = String(arg.defaultValue);
      });
      setFormValues(initialFormValues);
    }
  }, [pallet, method, customPalletMethods]);

  const formatValues = (
    values: { [key: string]: string },
    args: Argument[]
  ) => {
    return args.map(arg => {
      const value = values[arg.name];
      switch (arg.type) {
        case 'number':
          return Number(value);
        case 'boolean':
          return value === 'true';
        case 'number[]':
          return value.split(',').map(Number);
        case '[number, number][]':
          return JSON.parse(value);
        default:
          return value;
      }
    });
  };

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession || !builder) {
      console.log('Missing trnApi, signer, userSession or builder');
      return;
    }

    if (!pallet || !method) {
      console.log('Missing pallet or method');
      return;
    }

    const selectedMethod = customPalletMethods[pallet][method];
    const formattedValues = formatValues(formValues, selectedMethod.args);

    const extrinsic = trnApi.tx?.[pallet]?.[method](...formattedValues);

    builder.reset();
    builder.fromExtrinsic(extrinsic);

    if (feeAssetId === 2) {
      if (useFuturePass) {
        await builder.addFuturePass(userSession.futurepass);
      }
    }
    if (feeAssetId !== 2) {
      if (useFuturePass) {
        await builder.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
      if (!useFuturePass) {
        await builder.addFeeProxy({
          assetId: feeAssetId,
          slippage: Number(slippage),
        });
      }
    }

    getExtrinsic(builder);
    setCurrentBuilder(builder);
  }, [
    trnApi,
    signer,
    userSession,
    builder,
    pallet,
    method,
    customPalletMethods,
    formValues,
    feeAssetId,
    getExtrinsic,
    setCurrentBuilder,
    useFuturePass,
    slippage,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  return (
    <div className={`card ${disable ? 'disabled' : ''}`}>
      <div className="inner">
        <CodeView code={codeString}>
          <h3>Extrinsic Builder</h3>
        </CodeView>
        <div className="row">
          <label>
            Pallet
            <select
              value={pallet ?? ''}
              className="w-full builder-input"
              disabled={disable}
              onChange={e => {
                resetState();
                setMethod(null);
                setFormValues({});
                setPallet(
                  e.target.value !== ''
                    ? (e.target.value as keyof CustomPalletMethods)
                    : null
                );
              }}
            >
              <option value={''}>Select Pallet</option>
              {Object.keys(customPalletMethods).map(pallet => (
                <option key={pallet} value={pallet}>
                  {pallet}
                </option>
              ))}
            </select>
          </label>
        </div>
        {pallet && (
          <div className="row">
            <label>
              Method
              <select
                value={method ?? ''}
                className="w-full builder-input"
                disabled={disable}
                onChange={e => {
                  resetState();
                  setFormValues({});
                  setMethod(
                    e.target.value !== ''
                      ? (e.target.value as keyof Method)
                      : null
                  );
                }}
              >
                <option value={''}>Select Method</option>
                {pallet &&
                  Object.keys(customPalletMethods[pallet]).map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        )}
        {pallet && method && (
          <div style={{ marginBottom: '-8px', marginTop: '8px' }}>
            <label>Arguments</label>
          </div>
        )}
        {pallet && method && (
          <div className="row">
            {customPalletMethods[pallet][method].args.map(arg => (
              <div key={arg.name}>
                <label>
                  {arg.name} ({arg.type})
                  <input
                    type="text"
                    className="w-full builder-input"
                    disabled={disable}
                    onChange={e => {
                      if (arg.validation === 'address') {
                        if (e.target.value.length !== 42) {
                          setAddressError('Address is too long');
                        }
                        if (!isAddress(e.target.value)) {
                          setAddressError('Invalid address');
                        }
                        if (
                          isAddress(e.target.value) &&
                          e.target.value.length === 42
                        ) {
                          setAddressError(null);
                        }
                      }
                      handleInputChange(e);
                    }}
                    name={arg.name}
                    value={formValues[arg.name] ?? ''}
                  />
                  {arg.validation === 'address' && addressError && (
                    <span
                      style={{ display: 'inline-block', fontSize: '0.8rem' }}
                      className="text-red-500"
                    >
                      {addressError}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
        {pallet &&
          method &&
          formValues &&
          Object.keys(formValues).length ===
            customPalletMethods[pallet][method].args.length && (
            <div style={{ marginBottom: '-8px', marginTop: '8px' }}>
              <label>Origin Wallet & Gas Token</label>
            </div>
          )}
        {pallet &&
          method &&
          formValues &&
          Object.keys(formValues).length ===
            customPalletMethods[pallet][method].args.length && (
            <>
              <div className="row">
                <label>
                  Use FuturePass
                  <select
                    value={useFuturePass.toString()}
                    className="w-full builder-input"
                    onChange={e => {
                      resetState();
                      setUseFuturePass(
                        e.target.value === 'true' ? true : false
                      );
                    }}
                  >
                    <option value={'true'}>Use FuturePass</option>
                    {shouldShowEoa && (
                      <option value={'false'}>Do Not Use FuturePass</option>
                    )}
                  </select>
                </label>
              </div>
              <div className="row">
                <label>
                  Gas Token
                  <select
                    value={feeAssetId}
                    className="w-full builder-input"
                    disabled={disable}
                    onChange={e => {
                      resetState();
                      setFeeAssetId(Number(e.target.value));
                    }}
                  >
                    <option value={2}>XRP</option>
                    <option value={1}>ROOT</option>
                    <option value={3172}>SYLO</option>
                    <option value={17508}>ASTO</option>
                  </select>
                </label>
              </div>
              {feeAssetId !== 2 && (
                <div className="row">
                  <SliderInput
                    sliderValue={slippage}
                    setSliderValue={setSlippage}
                    minValue={0}
                    sliderStep={0.1}
                    maxValue={15}
                    resetState={resetState}
                  />
                </div>
              )}
              <div className="row">
                <button
                  className={`w-full builder-input green ${
                    disable || !!addressError ? 'disabled' : ''
                  }`}
                  onClick={() => {
                    resetState();
                    createBuilder();
                  }}
                  disabled={disable || !!addressError}
                  style={{ textTransform: 'capitalize' }}
                >
                  {method} {pallet}
                </button>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
