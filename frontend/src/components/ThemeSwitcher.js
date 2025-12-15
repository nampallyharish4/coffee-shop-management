import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { mode, setMode } = useTheme();

  const handleToggle = (e) => {
    const newMode = e.target.checked ? 'light' : 'dark';
    
    // View Transition API Check
    if (!document.startViewTransition) {
      setMode(newMode);
      return;
    }

    // Get click position (or center of switch if triggered via keyboard in a way that doesn't provide clientX/Y ideally, but input change event usually bubbles)
    // For a checkbox label click, we might want to use a ref to get the slider position, but event coordinates are easier for now.
    // Note: 'e' is a change event on checkbox. It doesn't always have clientX/Y.
    // We should wrap the label in a click handler or use a ref.
    // However, keeping it simple: let's try to get coordinates or default to center.
    
    // Better approach: Since 'onChange' might not give coordinates, let's look at the label click.
    // But 'onChange' is what we have. Let's try to get the rect of the target (the checkbox, or rather its label parent if possible).
    
    // Actually, 'e.nativeEvent' might help on click-triggered change.
    // Let's assume for a click toggle:
    const rect = e.target.closest('.switch').getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setMode(newMode);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      
      // Animate the new view (the one appearing) for dark -> light (expanding light)
      // Or old view (the one disappearing) for light -> dark (contracting light)?
      // The reference uses expanding circle for the *new* theme.

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 1500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
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
