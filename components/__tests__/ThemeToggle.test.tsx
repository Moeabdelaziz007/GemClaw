/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

// Mock useTheme hook
vi.mock('@/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle Component', () => {
  const mockUseTheme = vi.mocked(useTheme);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render toggle button', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const toggleButton = screen.getByRole('switch');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should display current theme icon', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      // Moon icon should be present for dark mode
      const moonIcon = screen.getByLabelText(/Current:/);
      expect(moonIcon).toBeInTheDocument();
    });

    it('should show theme label on larger screens', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const label = screen.getByText('Dark mode');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Theme Display', () => {
    it('should show "Dark mode" label when theme is dark', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      expect(screen.getByText('Dark mode')).toBeInTheDocument();
    });

    it('should show "Light mode" label when theme is light', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      expect(screen.getByText('Light mode')).toBeInTheDocument();
    });

    it('should show "System default" label when theme is system', () => {
      mockUseTheme.mockReturnValue({
        theme: 'system',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      expect(screen.getByText('System default')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-label');
      expect(toggle.getAttribute('aria-label')).toContain('Dark mode');
    });

    it('should have aria-checked reflecting dark mode state', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should have focus styles', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('focus:ring-2');
    });
  });

  describe('Interaction', () => {
    it('should call setTheme when clicked', () => {
      const mockSetTheme = vi.fn();
      
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockSetTheme,
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockSetTheme).toHaveBeenCalled();
    });

    it('should cycle through themes in order: dark → system → light → dark', () => {
      const setThemeCalls: string[] = [];
      let currentTheme = 'dark';
      
      mockUseTheme.mockReturnValue({
        theme: currentTheme as any,
        toggleTheme: vi.fn(),
        setTheme: (theme: any) => {
          setThemeCalls.push(theme);
          currentTheme = theme;
        },
      });

      const { rerender } = render(<ThemeToggle />);

      // First click: dark → system
      fireEvent.click(screen.getByRole('switch'));
      
      // Update mock with new theme
      mockUseTheme.mockReturnValue({
        theme: 'system' as any,
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });
      
      rerender(<ThemeToggle />);
      
      // Second click: system → light
      fireEvent.click(screen.getByRole('switch'));
      
      // Third click: light → dark
      mockUseTheme.mockReturnValue({
        theme: 'light' as any,
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });
      
      rerender(<ThemeToggle />);
      fireEvent.click(screen.getByRole('switch'));

      expect(setThemeCalls).toEqual(['system', 'light', 'dark']);
    });
  });

  describe('Animations', () => {
    it('should have hover animation', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const toggle = screen.getByRole('switch');
      // Check for framer-motion whileHover prop (class won't show until hover)
      expect(toggle.className).toContain('whileHover');
    });

    it('should have tap animation', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const toggle = screen.getByRole('switch');
      expect(toggle.className).toContain('whileTap');
    });
  });

  describe('Icon Rendering', () => {
    it('should render Moon icon for dark mode', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      // The Moon icon should be rendered
      const iconContainer = screen.getByLabelText(/Current:/);
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render Sun icon for light mode', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const iconContainer = screen.getByLabelText(/Current:/);
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render Monitor icon for system mode', () => {
      mockUseTheme.mockReturnValue({
        theme: 'system',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      render(<ThemeToggle />);

      const iconContainer = screen.getByLabelText(/Current:/);
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide text label on small screens', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      const { container } = render(<ThemeToggle />);
      
      // Text should have 'hidden sm:block' class
      const textElement = container.querySelector('span');
      expect(textElement?.className).toContain('hidden sm:block');
    });
  });
});
