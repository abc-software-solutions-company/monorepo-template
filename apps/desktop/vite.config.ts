import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    plugins: [react()] as UserConfig['plugins'],
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, './src') },
        { find: '@repo/react-web-ui-shadcn', replacement: resolve(__dirname, '../../packages/react-web-ui-shadcn/src') },
        { find: '@repo/shared-web', replacement: resolve(__dirname, '../../packages/shared-web/src') },
        { find: '@repo/shared-universal', replacement: resolve(__dirname, '../../packages/shared-universal/src') },
      ],
    },
  };
});
