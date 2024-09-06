import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/config-tailwindcss/tailwind.config';

const customConfig: Pick<Config, 'content' | 'presets' | 'theme'> = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/react-web-ui-shadcn/src/**/*.{ts,tsx}', '../../packages/shared-web/src/**/*.{ts,tsx}'],
  presets: [sharedConfig],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.938rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    fontFamily: {
      notosans: ['var(--font-notosans)', '"Noto Sans"'],
    },
  },
};

export default customConfig;
