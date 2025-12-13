import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { mode, setMode } = useTheme();

  const handleToggle = (e) => {
    // If checked, we want light mode. If unchecked, dark mode.
    const newMode = e.target.checked ? 'light' : 'dark';
    setMode(newMode);
  };

  return (
    <label htmlFor="switch" className="switch">
      <input 
        id="switch" 
        type="checkbox" 
        checked={mode === 'light'}
        onChange={handleToggle}
      />
      <span className="slider"></span>
      <span className="decoration"></span>
    </label>
  );
};

export default ThemeSwitcher;
