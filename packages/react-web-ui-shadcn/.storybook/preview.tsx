import type { Preview } from '@storybook/react';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import React from 'react';

import '../src/globals.scss';

const preview: Preview = {
  decorators: [
    (Story, { parameters }) => {
      const { pageLayout } = parameters;

      switch (pageLayout) {
        default:
          return <Story />;
      }
    },
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
};

export default preview;
