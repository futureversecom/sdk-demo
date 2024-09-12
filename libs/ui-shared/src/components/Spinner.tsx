import React from 'react';

export default function Spinner() {
  const spinnerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #000000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return <div style={spinnerStyle}></div>;
}
