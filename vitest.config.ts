import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.kombai/**',
      '**/.qoder/**',
      '**/.npm_cache/**',
      '**/.firebase/**',
      '**/.pnpm-store/**',
      '**/out/**',
      '**/e2e/**',
      'tests/components/NeuralPulse.test.tsx',
      'tests/api/agents.test.ts',
      'tests/firebase.test.ts',
      'tests/utils.test.ts',
      'tests/bridge.test.ts',
      'tests/serverAuth.test.ts',
      'tests/bridgeStatusManager.test.ts',
      'tests/components/ThemeToggle.test.tsx',
      'tests/components/AgentCard.test.tsx',
      'tests/athPackage.test.ts'
    ],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    watch: {
      ignored: ['**/.firebase/**', '**/.pnpm-store/**', '**/.npm_cache/**'],
    },
  },
});
