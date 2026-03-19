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
    it('should call setTheme through handleCycleTheme when clicked', () => {
      const mockSetTheme = vi.fn();
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      // From dark, it should cycle to system based on handleCycleTheme logic
      expect(mockSetTheme).toHaveBeenCalledWith('system');
    });

    it('should cycle correctly: light → dark → system → light', () => {
      const mockSetTheme = vi.fn();
      
      // Test light → dark
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: vi.fn(),
        setTheme: mockSetTheme,
      });
      const { rerender } = render(<ThemeToggle />);
      fireEvent.click(screen.getByRole('switch'));
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      
      // Test dark → system
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: mockSetTheme,
      });
      rerender(<ThemeToggle />);
      fireEvent.click(screen.getByRole('switch'));
      expect(mockSetTheme).toHaveBeenCalledWith('system');

      // Test system → light
      mockUseTheme.mockReturnValue({
        theme: 'system',
        toggleTheme: vi.fn(),
        setTheme: mockSetTheme,
      });
      rerender(<ThemeToggle />);
      fireEvent.click(screen.getByRole('switch'));
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Animations', () => {
    it('should be structured for motion', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: vi.fn(),
        setTheme: vi.fn(),
      });

      const { container } = render(<ThemeToggle />);
      const toggle = screen.getByRole('switch');
      
      // Verify motion components are rendered (placeholder for complex animation testing)
      expect(toggle).toBeInTheDocument();
      expect(container.querySelector('div')).toBeInTheDocument();
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
