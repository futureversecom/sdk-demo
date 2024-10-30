'use client';

import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { useLocalStorage } from '../hooks';

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useLocalStorage('fv-dark-mode', false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(darkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`toggle-button ${isDarkMode ? 'on' : 'off'}`}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export { DarkModeToggle };
