import { FC, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
import { format, isValid } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '~react-web-ui-shadcn/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { Matcher } from 'react-day-picker';
import { InputLabel } from './input-base';

const CURRENT_YEAR = new Date().getFullYear();

const inputVariants = cva('grid items-center relative w-full rounded-md border border-input bg-background leading-none ring-offset-background', {
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
      default: 'top-1/2 h-4 w-4 right-3',
      sm: 'top-1/2 h-3 w-3 right-3',
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
  'w-full px-3 bg-transparent text-sm flex justify-between font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed items-center',
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

type InputDateProps = {
  value: Date | undefined;
  label?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: 'default' | 'sm';
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  disableBefore?: Date;
  dateFormat?: string;
  onChange: (date: Date | undefined) => void;
};

const InputDate: FC<InputDateProps> = ({
  value,
  label,
  required = false,
  error = false,
  disabled = false,
  size = 'default',
  className,
  labelClassName,
  placeholder = 'Pick a date',
  fromYear = CURRENT_YEAR,
  toYear = CURRENT_YEAR + 10,
  disableBefore,
  dateFormat = 'dd/MM/yyyy',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getState = () => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (isOpen) return 'focused';
    return 'default';
  };

  const formattedDate = useMemo(() => {
    if (!value || !isValid(value)) return '';
    try {
      return format(value, dateFormat);
    } catch (e) {
      return '';
    }
  }, [value, dateFormat]);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className={cn(inputVariants({ size, state: getState() }), className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div>
            <CalendarDaysIcon size={20} className={triggerIconVariants({ size: 'default', state: disabled ? 'disabled' : 'default' })} />
            {label && <InputLabel label={label} required={required} size={size} className={cn(labelClassName)} />}
            <button type="button" disabled={disabled} className={cn(dateInputContentVariants({ size }), disabled && 'cursor-not-allowed')}>
              {formattedDate ? (
                <span className="text-foreground">{formattedDate}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            captionLayout="dropdown-buttons"
            fromYear={fromYear}
            toYear={toYear}
            defaultMonth={value}
            selected={value}
            disabled={{ before: disableBefore } as Matcher}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { InputDate };
