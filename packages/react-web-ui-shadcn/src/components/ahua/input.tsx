import React, { FC, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { InputLabel } from './input-base';

const formControlVariants = cva(
  'grid items-center relative w-full rounded-md border border-input bg-background leading-none ring-offset-background',
  {
    variants: {
      size: {
        default: 'h-14',
        sm: 'h-10',
      },
      state: {
        default: '',
        focused: 'ring-2 ring-ring ring-offset-2',
        disabled: 'cursor-not-allowed bg-muted',
        error: 'border-destructive bg-destructive/10',
        errorFocused: 'bg-destructive/10 ring-2 ring-destructive ring-offset-2',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

const inputContentVariants = cva(
  'w-full px-3 bg-transparent text-sm font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        default: 'py-1',
        sm: 'py-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'default' | 'sm';
  label?: string;
  required?: boolean;
  error?: boolean;
  labelClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, label, required = false, size = 'default', disabled = false, labelClassName, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getFormControlState = () => {
      if (disabled) return 'disabled';
      if (error) return isFocused ? 'errorFocused' : 'error';
      if (isFocused) return 'focused';
      return 'default';
    };

    return (
      <div className={cn(formControlVariants({ size, state: getFormControlState() }), className)}>
        <div>
          {label && <InputLabel label={label} required={required} size={size} className={cn(labelClassName)} />}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(inputContentVariants({ size }), 'peer', disabled && 'opacity-50')}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
