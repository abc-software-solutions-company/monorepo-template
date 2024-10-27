import React, { FC, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~react-web-ui-shadcn/lib/utils';

const inputVariants = cva('grid items-center relative w-full rounded-md border border-input bg-background leading-none ring-offset-background', {
  variants: {
    inputSize: {
      default: 'h-14',
      sm: 'h-10',
    },
    state: {
      default: '',
      focused: 'ring-2 ring-ring ring-offset-2',
      disabled: 'cursor-not-allowed bg-muted',
      error: 'border-destructive bg-destructive/10 focus-visible:ring-destructive',
    },
  },
  defaultVariants: {
    inputSize: 'default',
    state: 'default',
  },
});

const inputContentVariants = cva(
  'w-full px-3 bg-transparent text-sm font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
  {
    variants: {
      inputSize: {
        default: 'py-1',
        sm: 'py-0',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  }
);

const labelVariants = cva('px-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    inputSize: {
      default: 'text-xs',
      sm: 'text-[10px]',
    },
    state: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    inputSize: 'default',
    state: 'default',
  },
});

type LabelProps = {
  className?: string;
  label: string;
  required?: boolean;
  size?: 'default' | 'sm' | null;
  error?: boolean;
};

const Label: FC<LabelProps> = ({ label, required, className, size = 'default', error = false }) => (
  <label className={cn(labelVariants({ inputSize: size, state: error ? 'error' : 'default' }), className)}>
    {label}
    {required && <span className="ml-0.5 text-destructive">*</span>}
  </label>
);

type InputVariantProps = VariantProps<typeof inputVariants>;

interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputVariantProps['inputSize'];
  label?: string;
  required?: boolean;
  labelClassName?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, label, required = false, inputSize = 'default', disabled = false, error = false, labelClassName, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getState = () => {
      if (disabled) return 'disabled';
      if (error) return 'error';
      if (isFocused) return 'focused';

      return 'default';
    };

    return (
      <div
        className={cn(
          inputVariants({
            inputSize,
            state: getState(),
            className,
          })
        )}
      >
        <div>
          {label && <Label label={label} required={required} size={inputSize} className={cn(labelClassName)} error={error} />}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(inputContentVariants({ inputSize }), 'peer', disabled && 'opacity-50')}
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
