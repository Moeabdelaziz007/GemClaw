'use client';

import { useState, useEffect } from 'react';

/**
 * Theme type definition
 * - 'light': Force light mode
 * - 'dark': Force dark mode  
 * - 'system': Follow system preference
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * useTheme Hook
 * 
 * Provides theme management with localStorage persistence and system theme detection.
 * Automatically applies theme to document.documentElement and persists user preference.
 * 
 * @returns Object containing current theme, toggle function, and setTheme function
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme, setTheme } = useTheme();
 * 
 * return (
 *   <div>
 *     <p>Current theme: {theme}</p>
 *     <button onClick={toggleTheme}>Toggle Theme</button>
 *   </div>
 * );
 * ```
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  /**
   * Apply theme to document element
   * Handles 'system' theme by detecting OS preference
   */
  const applyTheme = (newTheme: Theme): void => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      // Detect system theme preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      // Apply explicit theme
      root.setAttribute('data-theme', newTheme);
    }
    
    // Persist to localStorage
    localStorage.setItem('aether-theme', newTheme);
  };

  /**
   * Initialize theme on mount
   * Loads saved preference or defaults to dark mode
   */
  useEffect(() => {
    setMounted(true);
    
    try {
      // Load saved theme from localStorage
      const saved = localStorage.getItem('aether-theme') as Theme | null;
      
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemeState(saved);
        applyTheme(saved);
      } else {
        // Default to dark mode if no preference saved
        setThemeState('dark');
        applyTheme('dark');
      }
    } catch (error) {
      console.error('[useTheme] Error loading theme:', error);
      // Fallback to dark mode
      setThemeState('dark');
      applyTheme('dark');
    }
  }, []);

  /**
   * Listen for system theme changes when in 'system' mode
   */
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  /**
   * Toggle between light and dark modes
   * If current is 'system', toggles based on actual system theme
   */
  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  /**
   * Set theme explicitly
   */
  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // Prevent SSR mismatch
  if (!mounted) {
    return {
      theme: 'dark' as Theme,
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }

  return {
    theme,
    toggleTheme,
    setTheme
  };
}

export default useTheme;
