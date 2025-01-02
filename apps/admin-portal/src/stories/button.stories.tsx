// src/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '~react-web-ui-shadcn/components/ui/button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A button component built with Radix UI Slot and styled with Tailwind CSS.

## Features
- Multiple variants including default, destructive, outline, secondary, ghost, and link
- Different sizes (xs, sm, default, lg, icon)
- Support for asChild prop to compose with other components
- Full keyboard navigation and focus management
- Disabled states handling
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'outline-destructive', 'secondary', 'ghost', 'link', 'transparent'],
      description: 'Style variant of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-sm'],
      description: 'Size variant of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary action button with prominent styling.',
      },
    },
  },
};

// Destructive variant
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used for destructive actions like delete or remove.',
      },
    },
  },
};

// Outline variant
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outlined button for secondary actions.',
      },
    },
  },
};

// Outline Destructive variant
export const OutlineDestructive: Story = {
  args: {
    children: 'Outline Destructive',
    variant: 'outline-destructive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outlined button with destructive styling.',
      },
    },
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Alternative button style for secondary actions.',
      },
    },
  },
};

// Ghost variant
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal styling, useful for toolbar actions.',
      },
    },
  },
};

// Link variant
export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button that looks like a link.',
      },
    },
  },
};

// Transparent variant
export const Transparent: Story = {
  args: {
    children: 'Transparent',
    variant: 'transparent',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with transparent background.',
      },
    },
  },
};

// Size variants
export const ExtraSmall: Story = {
  args: {
    children: 'Extra Small',
    size: 'xs',
  },
  parameters: {
    docs: {
      description: {
        story: 'Extra small size button.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

// Icon buttons
export const IconButton: Story = {
  args: {
    children: '🔔',
    size: 'icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Square button for icons.',
      },
    },
  },
};

export const SmallIconButton: Story = {
  args: {
    children: '⭐',
    size: 'icon-sm',
  },
};

// States
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity.',
      },
    },
  },
};

// Examples
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline-destructive">Outline Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="transparent">Transparent</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing all button variants together.',
      },
    },
  },
};

export const SizesShowcase: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔔</Button>
      <Button size="icon-sm">⭐</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing all button sizes together.',
      },
    },
  },
};

// Code examples in docs
export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`tsx
import { Button } from "@thienlam/react-web-ui-shadcn/src/components/ui/button";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Icon button
<Button size="icon">
  <IconComponent />
</Button>

// As child component
<Button asChild>
  <Link href="/about">About Page</Link>
</Button>
\`\`\`
        `,
      },
    },
  },
};
