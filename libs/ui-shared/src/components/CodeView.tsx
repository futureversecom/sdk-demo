'use client';

import React, { PropsWithChildren } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useCopyToClipboard } from '../hooks';
import { hooksCodeString } from '../lib/hooksCodeString';
import { rootStoreCodeString } from '../lib/rootStoreCodeString';
export default function CodeView({
  children,
  code,
  helperCode,
}: PropsWithChildren<{ code: string; helperCode?: string }>) {
  const [showCode, setShowCode] = React.useState(false);
  const [showHooksCode, setShowHooksCode] = React.useState(false);
  const [showHelperCode, setShowHelperCode] = React.useState(false);
  const [showRootStore, setShowRootStore] = React.useState(false);

  const getCodeString = () => {
    if (showHooksCode) {
      return hooksCodeString;
    } else if (showHelperCode && helperCode) {
      return helperCode;
    } else if (showRootStore) {
      return rootStoreCodeString;
    } else {
      return code;
    }
  };

  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const closeAll = () => {
    setShowHooksCode(false);
    setShowHelperCode(false);
    setShowRootStore(false);
  };

  const closeCodeViewer = () => {
    closeAll();
    setShowCode(false);
  };

  return (
    <div className="code-viewer">
      <div className="title-row">{children}</div>
      <div className="code-view-buttons">
        <button
          className="code-btn green"
          onClick={() => copyToClipboard(code)}
        >
          {isCopied ? (
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 17.837 17.837"
              width="24"
              height="24"
            >
              <g>
                <path
                  fill="currentColor"
                  d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
		c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
		L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                />
              </g>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          )}
        </button>
        <button className="code-btn green" onClick={() => setShowCode(true)}>
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M553 1399l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23t-10 23l-393 393 393 393q10 10 10 23t-10 23zm591-1067l-373 1291q-4 13-15.5 19.5t-23.5 2.5l-62-17q-13-4-19.5-15.5t-2.5-24.5l373-1291q4-13 15.5-19.5t23.5-2.5l62 17q13 4 19.5 15.5t2.5 24.5zm657 651l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23t-10 23z" />
          </svg>
        </button>
      </div>
      {showCode && (
        <div className="code-view" onClick={() => setShowCode(false)}>
          <div className="button-row">
            {helperCode && (
              <button
                className="hooks-btn green"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeAll();
                  setShowHelperCode(!showHelperCode);
                }}
              >
                {showHelperCode ? 'Hide' : 'View'} Helper Code
              </button>
            )}

            <button
              className="hooks-btn green"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                closeAll();
                setShowHooksCode(!showHooksCode);
              }}
            >
              {showHooksCode ? 'Hide' : 'View'} Hooks
            </button>

            <button
              className="hooks-btn green"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                closeAll();
                setShowRootStore(!showRootStore);
              }}
            >
              {showRootStore ? 'Hide' : 'View'} Root Store
            </button>

            <button
              className="copy-code-btn green"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(code);
              }}
            >
              {isCopied ? (
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 17.837 17.837"
                  width="24"
                  height="24"
                >
                  <g>
                    <path
                      fill="currentColor"
                      d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
		c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
		L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                    />
                  </g>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
              )}
            </button>
            <button
              className="close-code-btn green"
              onClick={() => closeCodeViewer()}
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <g>
                    <polygon
                      points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512
                 512,452.922 315.076,256 		"
                    />
                  </g>
                </g>
              </svg>
            </button>
          </div>

          <div
            className="code-view-wrapper"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDoubleClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <SyntaxHighlighter language="javascript" style={dracula}>
              {getCodeString()}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}
