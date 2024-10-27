import { FC, useState } from 'react';
import { cva } from 'class-variance-authority';
import { format } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '~react-web-ui-shadcn/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';

const dateInputVariants = cva('grid items-center relative w-full rounded-md border border-input bg-background leading-none ring-offset-background', {
  variants: {
    size: {
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
    size: 'default',
    state: 'default',
  },
});

const triggerIconVariants = cva('text-muted-foreground absolute -translate-y-1/2', {
  variants: {
    size: {
      default: 'top-1/2 h-4 w-4 right-2',
      sm: 'top-1/2 h-3 w-3 right-2',
    },
    state: {
      default: '',
      disabled: 'opacity-50',
    },
  },
  defaultVariants: {
    size: 'default',
    state: 'default',
  },
});

const dateInputContentVariants = cva(
  'w-full px-3 bg-transparent text-sm flex justify-between font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed flex items-center',
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

const labelVariants = cva('px-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    size: {
      default: 'text-xs',
      sm: 'text-[10px]',
    },
    state: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'default',
    state: 'default',
  },
});

type InputDateProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: 'default' | 'sm';
  className?: string;
  labelClassName?: string;
  placeholder?: string;
};

const InputDate: FC<InputDateProps> = ({
  value,
  onChange,
  label,
  required = false,
  error = false,
  disabled = false,
  size = 'default',
  className,
  labelClassName,
  placeholder = 'Pick a date',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getState = () => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'focused';

    return 'default';
  };

  return (
    <div className={cn(dateInputVariants({ size, state: getState() }), className)}>
      <Popover onOpenChange={open => setIsFocused(open)}>
        <PopoverTrigger asChild>
          <div>
            <CalendarDaysIcon size={20} className={triggerIconVariants({ size: 'default', state: disabled ? 'disabled' : 'default' })} />
            {label && (
              <label className={cn(labelVariants({ size, state: error ? 'error' : 'default' }), labelClassName)}>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </label>
            )}
            <button type="button" disabled={disabled} className={cn(dateInputContentVariants({ size }), disabled && 'cursor-not-allowed')}>
              {value ? <span className="text-foreground">{format(value, 'PPP')}</span> : <span className="text-muted-foreground">{placeholder}</span>}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="single" captionLayout="dropdown-buttons" defaultMonth={value} selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { InputDate };
