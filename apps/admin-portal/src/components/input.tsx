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
    },
  },
  defaultVariants: {
    inputSize: 'default',
    state: 'default',
  },
});

const inputContentVariants = cva(
  'w-full px-3 bg-transparent text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
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

const labelVariants = cva('text-muted-foreground px-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    inputSize: {
      default: 'text-xs',
      sm: 'text-[10px]',
    },
  },
  defaultVariants: {
    inputSize: 'default',
  },
});

type LabelProps = {
  className?: string;
  label: string;
  required?: boolean;
  size?: 'default' | 'sm' | null;
};

const Label: FC<LabelProps> = ({ label, required, className, size = 'default' }) => (
  <label className={cn(labelVariants({ inputSize: size }), className)}>
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
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, label, required = false, inputSize = 'default', disabled = false, labelClassName, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div
        className={cn(
          inputVariants({
            inputSize,
            state: disabled ? 'disabled' : isFocused ? 'focused' : 'default',
            className,
          })
        )}
      >
        <div>
          {label && <Label label={label} required={required} size={inputSize} className={cn(labelClassName)} />}
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
