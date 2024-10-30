'use client';
import { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import {
  AuthThemeProvider,
  CustodialOptions,
  Modal,
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
  theme: 'dark',
  colors: {
    primaryColor: '#0b0b0b',
    socialPrimaryColor: '#fff',
    socialSecondaryColor: '#0b0b0b',
    secondaryColor: '#e7eeef',
    backgroundColor: '#121212',
    borderColor: '#e7eeef',
    textColor: '#fff',
  },
  defaultAuthOption: 'web3',
  hideCustodial: false,
  hideWeb3: false,
  images: {
    backgroundImage: '',
    logo: '',
  },
  // font: {
  //   fontUrl: '',
  //   fontName: '',
  // },
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
  console.log('key', key, 'value', value);
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

  console.log('connectors', connectors);

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

  console.log('web3AuthOptions', web3AuthOptions);

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

  // useEffect(() => {
  //   if (firstRender) {
  //     setFirstRender(false);
  //     // openLogin();
  //     // disableAuthLoginButtons();

  //     // setTimeout(() => {
  //     //   // const uiDialog = document.querySelector('.fvaui-dialog');
  //     //   // console.log('uiDialog', uiDialog);
  //     //   // if (uiDialog) {
  //     //   //   document.querySelector('.ui-inject')?.appendChild(uiDialog);
  //     //     uiDialog.setAttribute('style', 'position:relative');
  //     //   }
  //     // }, 1000);
  //   }
  // }, [firstRender, openLogin]);

  useEffect(() => {
    return () => {
      document.removeEventListener('click', buttonDisable);
    };
  }, []);

  const [themeConfig, setThemeConfig] = useState(defaultTheme);

  const { theme, colors, ...filteredConfig } = themeConfig as {
    [key: string]: unknown;
  };

  const handleChange = (key: string, value: unknown) => {
    const keys = key.split('.');
    const lastKey = keys.pop() as string;
    const nestedConfig = keys.reduce(
      (obj, k) => (obj as any)[k],
      themeConfig
    ) as any;

    if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      typeof value === 'object'
    ) {
      (nestedConfig as any)[lastKey] = value;
    }
    setThemeConfig({ ...themeConfig });
  };

  const handleColorChange = (key: string, color: any) => {
    const currentColor =
      themeConfig.colors[key as keyof typeof themeConfig.colors];

    const newColor = isHex(currentColor) ? color.hex : rgbaToString(color.rgb);

    setThemeConfig({
      ...themeConfig,
      colors: {
        ...themeConfig.colors,
        [key]: newColor,
      },
    });
  };

  // const handleImages = (key: 'backgroundImage' | 'logo', value: string) => {
  //   setThemeConfig({
  //     ...themeConfig,
  //     images: {
  //       ...themeConfig.images,
  //       [key]: value,
  //     },
  //   });
  // };

  const handleThemeOptions = (key: string, value: string) => {
    setThemeConfig({
      ...themeConfig,
      [key]: value,
    });
  };

  // const handleInputChange = (key: string, value: string) => {
  //   setThemeConfig({
  //     ...themeConfig,
  //     font: {
  //       ...themeConfig.font,
  //       [key]: value,
  //     },
  //   });
  // };

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
          <div className="row" style={{ marginTop: '8px' }}>
            <h3>Theme</h3>
            <div>
              <select
                className="w-full builder-input"
                value={themeConfig.theme}
                onChange={e =>
                  handleThemeOptions(
                    'theme',
                    e.target.value as 'dark' | 'light'
                  )
                }
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
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
                onShowDetails={() => console.log('')}
                onCloseDetails={() => console.log('')}
                onBack={() => console.log('')}
                detailsOpen={false}
                connectAndSignIn={async () => console.log('connectAndSignIn')}
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
