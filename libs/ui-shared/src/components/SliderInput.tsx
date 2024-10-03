import React, { useMemo } from 'react';

type SendFromProps = {
  sliderValue: string;
  setSliderValue: (value: string) => void;
  maxValue?: number;
  minValue?: number;
  sliderStep?: number;
  resetState: () => void;
  label?: string;
};

export default function SliderInput({
  sliderValue,
  setSliderValue,
  maxValue = 100,
  minValue = 0,
  sliderStep = 1,
  resetState,
  label = 'Slippage',
}: SendFromProps) {
  return (
    <label>
      <div style={{ marginTop: '8px', marginBottom: '8px' }}>{label}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', width: 'calc(100% - 100px)' }}>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={sliderStep}
            onChange={e => {
              resetState();
              setSliderValue(e.target.value);
            }}
            style={{
              width: '100%',
              backgroundColor: '#7bff0046',
              padding: '0',
              height: '2px',
              marginTop: '8px',
              marginBottom: '8px',
              zIndex: 2,
            }}
            value={sliderValue}
          />
          <div
            style={{
              position: 'absolute',
              width: `calc(${(Number(sliderValue) * 100) / maxValue}%)`,
              height: '2px',
              backgroundColor: '#7bff00',
              padding: '0',
              marginTop: '8px',
              marginBottom: '8px',
              left: 0,
              top: 0,
              zIndex: 1,
            }}
          ></div>
        </div>
        <div
          style={{
            width: '100px',
            fontSize: '1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'block',
              border: '1px solid #7bff00',
              padding: '12px 8px',
              lineHeight: '1',
              borderRadius: '8px',
            }}
          >
            {sliderValue}%
          </div>
        </div>
      </div>
    </label>
  );
}
