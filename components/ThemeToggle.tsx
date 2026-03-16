'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/hooks/useTheme';

/**
 * ThemeToggle Component
 * 
 * Animated theme switcher with three modes: Light, Dark, and System.
 * Features smooth framer-motion animations and full accessibility support.
 * 
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();

  /**
   * Cycle through themes: light → dark → system → light
   */
  const handleCycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  /**
   * Get current theme icon
   */
  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
    }
  };

  const CurrentIcon = getCurrentIcon();

  /**
   * Get theme label for accessibility
   */
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System default';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Button */}
      <motion.button
        onClick={handleCycleTheme}
        className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 overflow-hidden focus:outline-none focus:ring-2 focus:ring-gemigram-neon focus:ring-offset-2 focus:ring-offset-transparent"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Current: ${getThemeLabel()}. Click to change theme.`}
        role="switch"
        aria-checked={theme === 'dark'}
      >
        {/* Background Gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(59,130,246,0.2) 100%)'
                : theme === 'light'
                ? 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(251,146,60,0.2) 100%)'
                : 'linear-gradient(135deg, rgba(100,116,139,0.3) 0%, rgba(75,85,99,0.2) 100%)'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Slider Circle */}
        <motion.div
          className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            x: theme === 'dark' ? 0 : theme === 'light' ? 28 : 56,
            backgroundColor:
              theme === 'dark'
                ? '#06b6d4'
                : theme === 'light'
                ? '#f59e0b'
                : '#64748b'
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-white" strokeWidth={2.5} />
              ) : theme === 'light' ? (
                <Sun className="w-3 h-3 text-white" strokeWidth={2.5} />
              ) : (
                <Monitor className="w-3 h-3 text-white" strokeWidth={2.5} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.button>

      {/* Theme Indicator Text (Optional - shows current mode) */}
      <motion.span
        className="text-xs font-medium text-white/60 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={theme}
      >
        {getThemeLabel()}
      </motion.span>
    </div>
  );
}

export default ThemeToggle;
