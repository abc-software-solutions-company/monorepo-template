import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/config-tailwindcss/tailwind.config';

const customConfig: Pick<Config, 'content' | 'presets' | 'theme'> = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/react-web-ui-shadcn/src/**/*.{ts,tsx}',
    '../../packages/shared-web/src/**/*.{ts,tsx}',
    '../../packages/shared-universal/src/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
  theme: {
    fontFamily: {
      notosans: ['"Noto Sans"'],
    },
  },
};

export default customConfig;
