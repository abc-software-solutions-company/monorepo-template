import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from 'path';

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-essentials'),
    // getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  docs: {
    autodocs: true,
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');

    if (configType === 'DEVELOPMENT') {
    }
    if (configType === 'PRODUCTION') {
    }
    return mergeConfig(config, {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@repo/react-web-ui-shadcn': '/src',
        },
      },
    });
  },
};

export default config;
