import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return;
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;

        warn(warning);
      },
    },
  },
  plugins: [react()],
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
});
