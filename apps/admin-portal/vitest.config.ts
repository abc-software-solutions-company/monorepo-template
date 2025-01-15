import path from 'path';
import { defineConfig, ViteUserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()] as ViteUserConfig['plugins'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './__tests__'),
      '@mocks': path.resolve(__dirname, './__mocks__'),
      '@repo/react-web-ui-shadcn': path.resolve(__dirname, '../../packages/react-web-ui-shadcn/src'),
      '@repo/shared-web': path.resolve(__dirname, '../../packages/shared-web/src'),
      '@repo/shared-universal': path.resolve(__dirname, '../../packages/shared-universal/src'),
    },
  },
  test: {
    // deps: {
    //   moduleDirectories: ['node_modules', path.resolve('../../packages')],
    // },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/unit/setup/index.ts'],
    include: ['./src/**/*.{test,spec}.{ts,tsx}', './__tests__/unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/libs'],
      provider: 'v8', // 'v8', 'istanbul'
      reportsDirectory: './coverage-unit',
      extension: ['.ts', '.tsx', '.js', '.jsx'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
