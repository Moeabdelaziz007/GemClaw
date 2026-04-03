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
      'tests/firebase.test.ts',
      '__tests__/api/agents.test.ts',
      'tests/athPackage.test.ts',
      'tests/utils.test.ts',
      'tests/bridge.test.ts',
      'tests/components/NeuralPulse.test.tsx',
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
