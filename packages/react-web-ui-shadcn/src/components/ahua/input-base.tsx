import { cva } from 'class-variance-authority';
import { FC } from 'react';
import { cn } from '~react-web-ui-shadcn/lib/utils';

const inputLabelVariants = cva('block text-muted-foreground px-3 font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    size: {
      default: '!leading-[26px] text-[12px]',
      sm: '!leading-[16px] text-[10px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface IInputLabelProps {
  className?: string;
  label: string;
  required?: boolean;
  size?: 'default' | 'sm';
}

export const InputLabel: FC<IInputLabelProps> = ({ className, label, required, size = 'default' }) => (
  <label className={cn(inputLabelVariants({ size }), className)}>
    {label}
    {required && <span className="text-destructive ml-0.5">*</span>}
  </label>
);
