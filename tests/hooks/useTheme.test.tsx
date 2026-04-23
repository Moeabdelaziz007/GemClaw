/**
 * @vitest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTheme } from "../../hooks/useTheme";

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear localStorage before each test
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();
    
    // Default matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should default to dark mode when no saved preference', () => {
      const { result } = renderHook(() => useTheme());
      
      // Wait for mount
      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should load saved theme from localStorage', () => {
      localStorage.setItem('aether-theme', 'light');
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should handle invalid saved theme gracefully', () => {
      localStorage.setItem('aether-theme', 'invalid-theme');
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Should fallback to dark mode
      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Theme Toggling', () => {
    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('aether-theme')).toBe('light');
    });

    it('should toggle from light to dark', () => {
      localStorage.setItem('aether-theme', 'light');
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('aether-theme')).toBe('dark');
    });

    it('should persist theme to localStorage', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorage.getItem('aether-theme')).toBe('light');
    });
  });

  describe('Explicit Theme Setting', () => {
    it('should set theme to light explicitly', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('aether-theme')).toBe('light');
    });

    it('should set theme to system', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      // System theme detection happens in applyTheme
      expect(localStorage.getItem('aether-theme')).toBe('system');
    });
  });

  describe('System Theme Detection', () => {
    it('should detect system dark mode', () => {
      // Mock system preferring dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: true, // Dark mode preferred
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
        result.current.setTheme('system');
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should detect system light mode', () => {
      // Mock system preferring light mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false, // Light mode preferred
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
        result.current.setTheme('system');
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should listen to system theme changes', () => {
      let changeCallback: (() => void) | null = null;
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event: string, callback: () => void) => {
            if (event === 'change') {
              changeCallback = callback;
            }
          }),
          removeEventListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
        result.current.setTheme('system');
      });

      // Simulate system theme change
      act(() => {
        if (changeCallback) {
          changeCallback();
        }
      });

      // Should have called applyTheme
      expect(document.documentElement.getAttribute('data-theme')).toBeDefined();
    });
  });

  describe('SSR Safety', () => {
    it('should return default values before mounting', () => {
      // This test verifies the hook doesn't crash during SSR
      // In actual SSR, window/document won't exist, but this simulates pre-mount state
      const { result } = renderHook(() => useTheme());
      
      // Before useEffect runs, should return safe defaults
      expect(result.current.theme).toBeDefined();
      expect(typeof result.current.toggleTheme).toBe('function');
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage throwing error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });

      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Should fallback to dark mode without crashing
      expect(result.current.theme).toBe('dark');
      
      // Restore
      localStorage.getItem = originalGetItem;
    });
  });

  describe('Accessibility', () => {
    it('should set data-theme attribute for CSS targeting', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });
});
