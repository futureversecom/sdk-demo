'use client';
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import {
  AuthThemeProvider,
  CustodialOptions,
  Modal,
  DefaultTheme,
  ThemeConfig as OriginalThemeConfig,
  State,
  Web3Options,
} from '@futureverse/auth-ui';
import { buttonDisable } from '../../lib';
import { useConnectors } from 'wagmi';
import { CopyButton } from '../CopyButton';

interface ThemeConfig extends OriginalThemeConfig {
  [key: string]: unknown;
}

const isHex = (color: string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
const rgbaToString = (rgba: { r: number; g: number; b: number; a: number }) =>
  `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

const defaultTheme: ThemeConfig = {
  ...DefaultTheme,
  defaultAuthOption: 'web3',
  colors: {
    primaryBackground: 'rgba(246, 246, 247, 0.1)',
    primaryForeground: 'rgba(246, 246, 247, 1)',
    primaryHover: 'rgba(246, 246, 247, 0.2)',
    primaryActive: 'rgba(246, 246, 247, 0.2)',
    primaryBackgroundDisabled: 'rgba(55, 55, 57, 1)',
    primaryForegroundDisabled: 'rgba(103, 102, 109, 1)',
    secondaryBackground: 'rgba(246, 246, 247, 0)',
    secondaryForeground: 'rgba(206, 207, 211, 1)',
    secondaryHover: 'rgba(246, 246, 247, 0)',
    secondaryActive: 'rgba(246, 246, 247, .05)',
    secondaryBackgroundDisabled: 'rgba(55, 55, 57, 1)',
    secondaryForegroundDisabled: 'rgba(103, 102, 109, 1)',
    border: 'rgba(55, 55, 57, 1)',
    borderHover: 'rgba(246, 246, 247, 1)',
    borderActive: 'rgba(246, 246, 247, 1)',
    borderError: 'rgba(171, 22, 57, 1)',
    errorForeground: 'rgba(171, 22, 57, 1)',
    body: 'rgba(246, 246, 247, 1)',
    muted: 'rgba(206, 207, 211, 1)',
    surface: 'rgba(12, 12, 12, 1)',
    page: 'rgba(255, 91, 39, 1)',
  },
  font: {
    fontUrl: '',
    fontName: '',
  },
  images: {
    logo: '',
    background: '',
  },
};

const formatKey = (key: string) => {
  const keyToUse = key.includes('.') ? (key.split('.').pop() as string) : key;

  return keyToUse
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const renderInput = (
  key: string,
  value: unknown,
  handleChange: (key: string, value: unknown) => void
) => {
  if (key === 'defaultAuthOption') {
    return (
      <div className="row" key={key}>
        <div className="row">
          <label>{formatKey(key)}</label>
        </div>
        <div className="row">
          <select
            key={key}
            className="w-full builder-input"
            value={value as string}
            onChange={e => handleChange(key, e.target.value)}
          >
            <option value="web3">web3</option>
            <option value="custodial">custodial</option>
          </select>
        </div>
      </div>
    );
  }
  if (typeof value === 'boolean') {
    return (
      <div className="row" key={key}>
        <div className="row">
          <label>{formatKey(key)}</label>
        </div>
        <div className="row">
          <select
            key={key}
            className="w-full builder-input"
            value={value.toString()}
            onChange={e => handleChange(key, e.target.value === 'true')}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>
      </div>
    );
  } else if (typeof value === 'string') {
    return (
      <div className="row" key={key}>
        <div className="row">
          <label>{formatKey(key)}</label>
        </div>
        <div className="row">
          <input
            key={key}
            type="text"
            className="w-full builder-input"
            value={value}
            onChange={e => handleChange(key, e.target.value)}
          />
        </div>
      </div>
    );
  } else if (typeof value === 'object' && value !== null) {
    return (
      <div key={key} style={{ marginTop: '16px' }}>
        <h4 style={{ textTransform: 'capitalize' }}>{formatKey(key)}</h4>
        {Object.entries(value).map(([nestedKey, nestedValue]) =>
          renderInput(`${key}.${nestedKey}`, nestedValue, handleChange)
        )}
      </div>
    );
  }
};

export const AuthUiCustomiser = () => {
  const [currentState] = useState<State>(State.IDLE);

  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
    null
  );
  const [canClose, setCanClose] = useState(false);

  const connectors = useConnectors();

  const web3AuthOptions: Web3Options[] = connectors
    .filter(conn => !conn.type.startsWith('FutureverseCustodial'))
    .filter(connector => connector.id !== 'io.metamask')
    .filter(connector => connector.id !== 'com.coinbase.wallet')
    .map(connector => {
      return {
        icon: connector.icon ?? connector.name,
        title: connector.name,
        id: connector.id,
        installed: false,
      } as Web3Options;
    });

  const custodialAuthOptions: CustodialOptions[] = connectors
    .filter(conn => conn.type.startsWith('FutureverseCustodial'))
    .filter(connector => connector.name !== 'Email')
    .map(
      connector =>
        ({
          icon: connector.icon ?? connector.name,
          title: connector.name,
          id: connector.id,
          iconDark: connector.iconDark,
          iconLight: connector.iconLight,
        } as CustodialOptions)
    );

  useEffect(() => {
    return () => {
      document.removeEventListener('click', buttonDisable);
    };
  }, []);

  const [themeConfig, setThemeConfig] = useState(defaultTheme);

  const { theme, colors, font, ...filteredConfig } = themeConfig as {
    [key: string]: unknown;
  };

  const handleChange = (key: string, value: unknown) => {
    const keys = key.split('.');
    const lastKey = keys.pop() as string;
    const nestedConfig = keys.reduce(
      (obj: { [key: string]: unknown }, k: string) =>
        obj[k] as { [key: string]: unknown },
      themeConfig
    ) as { [key: string]: unknown };

    if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      typeof value === 'object'
    ) {
      (nestedConfig as { [key: string]: unknown })[lastKey] = value;
    }
    setThemeConfig({ ...themeConfig });
  };

  const handleColorChange = (
    key: string,
    color: { hex: string; rgb: { r: number; g: number; b: number; a?: number } }
  ) => {
    const currentColor =
      themeConfig.colors[key as keyof typeof themeConfig.colors];

    const newColor = isHex(currentColor)
      ? color.hex
      : rgbaToString({
          ...color.rgb,
          a: color.rgb.a ?? 1,
        });

    setThemeConfig({
      ...themeConfig,
      colors: {
        ...themeConfig.colors,
        [key]: newColor,
      },
    });
  };

  return (
    <>
      <div
        className="card"
        onClick={() => {
          canClose && setActiveColorPicker(null);
          setCanClose(false);
        }}
      >
        <div className="inner">
          <div className="row">
            <h2>Customise Theme</h2>
          </div>

          <div className="row" style={{ marginTop: '16px' }}>
            <h3>Colors</h3>
            <div>
              {Object.keys(themeConfig.colors).map(colorKey => (
                <div key={colorKey} style={{ marginTop: '8px' }}>
                  <div
                    className="row"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <div
                      onClick={() =>
                        setActiveColorPicker(
                          activeColorPicker === colorKey ? null : colorKey
                        )
                      }
                      style={{
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        backgroundColor:
                          themeConfig.colors[
                            colorKey as keyof typeof themeConfig.colors
                          ],
                        border: '1px solid #ccc',
                        borderRadius: '16px',
                      }}
                    ></div>
                    <label
                      style={{ marginRight: '10px', position: 'relative' }}
                    >
                      {' '}
                      {activeColorPicker === colorKey && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            transform: 'translateX(0)',
                            zIndex: 9,
                          }}
                          onMouseLeave={() => {
                            setCanClose(true);
                          }}
                          onMouseEnter={() => {
                            setCanClose(false);
                          }}
                          onMouseOver={() => {
                            setCanClose(false);
                          }}
                        >
                          <SketchPicker
                            color={
                              themeConfig.colors[
                                colorKey as keyof typeof themeConfig.colors
                              ]
                            }
                            onChange={color =>
                              handleColorChange(colorKey, color)
                            }
                          />
                        </div>
                      )}
                      {formatKey(colorKey)}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{ marginTop: '16px' }}>
              <h3>Other Options</h3>
              <div>
                {Object.entries(filteredConfig).map(([key, value]) =>
                  renderInput(key, value, handleChange)
                )}
              </div>
            </div>

            {/* <h3>Font</h3>
      <div>
        <label>Font URL</label>
        <input
          type="text"
          value={themeConfig.font.fontUrl}
          onChange={e => handleInputChange('fontUrl', e.target.value)}
        />
      </div>
      <div>
        <label>Font Name</label>
        <input
          type="text"
          value={themeConfig.font.fontName}
          onChange={e => handleInputChange('fontName', e.target.value)}
        />
      </div> */}
            {/* <div className="row" style={{ marginTop: '16px' }}>
              <button
                onClick={() => {
                  openLogin();
                  disableAuthLoginButtons();
                }}
                className="green w-full builder-input"
              >
                Preview Theme
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="card ui-inject">
        <div className="inject-inner">
          <div className="inject-inner-overflow">
            <AuthThemeProvider themeConfig={themeConfig}>
              <Modal
                show={true}
                onClose={() => console.log('close')}
                currentState={currentState}
                currentConnector={undefined}
                custodialAuthOptions={custodialAuthOptions}
                web3AuthOptions={web3AuthOptions}
                themeConfig={themeConfig}
                onBack={() => console.log('')}
                connectAndSignIn={async () => console.log('connectAndSignIn')}
                onSignPass={async () => console.log('onSignPass')}
              ></Modal>
            </AuthThemeProvider>
          </div>
        </div>
      </div>
      <div className="card" style={{ maxWidth: '400px' }}>
        <div className="inner">
          <div
            className="row"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <h3>Current Theme Configuration</h3>
            <CopyButton contentToCopy={themeConfig} />
          </div>
          <pre>{JSON.stringify(themeConfig, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};
