import React from 'react';

type URLInputProps = {
  inputUrl: string;
  setInputUrl: (address: string) => void;
  urlInputError: string;
  setUrlInputError: (error: string) => void;
  disable?: boolean;
  resetState?: () => void;
  label?: string;
};

export const URLInput: React.FC<URLInputProps> = ({
  inputUrl,
  setInputUrl,
  urlInputError,
  setUrlInputError,
  disable,
  resetState,
  label = 'Send To',
}: URLInputProps) => {
  const validateURL = (input: string) => {
    const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*\/)$/;
    return urlPattern.test(input);
  };

  const handleChange = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    setInputUrl(inputValue);

    if (inputValue === '' || validateURL(inputValue)) {
      setUrlInputError('');
    } else {
      setUrlInputError(
        'Please enter a valid URL ending with a trailing slash.'
      );
    }
    resetState && resetState();
  };

  return (
    <label htmlFor="url-input">
      {label}
      <input
        className="w-full builder-input"
        id="url-input"
        type="text"
        value={inputUrl}
        onChange={handleChange}
        placeholder="https://example.com/"
        disabled={disable}
      />
      {urlInputError !== '' && (
        <span
          style={{ display: 'inline-block', fontSize: '0.8rem' }}
          className="text-red-500"
        >
          {urlInputError}
        </span>
      )}
    </label>
  );
};
