import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { Input } from '~react-web-ui-shadcn/components/ahua/input';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

import { HelperText } from './form-field-base';

type FormFieldInputNumberProps<T extends FieldValues> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  size?: 'default' | 'sm';
  required?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  allowNegative?: boolean;
  isInteger?: boolean;
  maxLength?: number;
  onChange?: (value: string) => void;
};

export default function FormFieldInputNumber<T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  placeholder = '',
  visibled = true,
  disabled,
  size = 'default',
  required,
  showErrorMessage = true,
  helperText,
  min,
  max,
  step = 1,
  allowNegative = true,
  isInteger = true,
  maxLength,
  onChange,
}: FormFieldInputNumberProps<T>) {
  if (!visibled) return null;

  const handleChange = (value: string): string | null => {
    if (!value) {
      onChange?.('');

      return null;
    }

    let cleanedValue = value.replace(/[^\d.-]/g, '');

    if (!allowNegative) {
      cleanedValue = cleanedValue.replace(/-/g, '');
    }

    if (isInteger) {
      cleanedValue = cleanedValue.split('.')[0];
    } else {
      const parts = cleanedValue.split('.');

      if (parts.length > 2) {
        cleanedValue = `${parts[0]}.${parts.slice(1).join('')}`;
      }
    }

    if (maxLength !== undefined && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.slice(0, maxLength);
    }

    if (cleanedValue === '-' || (!isInteger && cleanedValue === '.')) {
      onChange?.('');

      return null;
    }

    let numberValue = Number(cleanedValue);

    if (isNaN(numberValue)) {
      onChange?.('');

      return null;
    }

    if (step && !isInteger) {
      const precision = step.toString().split('.')[1]?.length || 0;

      numberValue = Number(Number(Math.round(numberValue / step) * step).toFixed(precision));
    } else if (isInteger) {
      numberValue = Math.round(numberValue);
    }

    onChange?.(numberValue.toString());

    return numberValue.toString();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    const cursorPosition = e.currentTarget.selectionStart;

    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
      return;
    }

    const allowedChars = isInteger ? (allowNegative ? /[-\d]/ : /\d/) : allowNegative ? /[-\d.]/ : /[\d.]/;

    if (!allowedChars.test(e.key)) {
      e.preventDefault();

      return;
    }

    if (isInteger && e.key === '.') {
      e.preventDefault();

      return;
    }

    if (!isInteger && e.key === '.' && currentValue.includes('.')) {
      e.preventDefault();

      return;
    }

    if (e.key === '-') {
      if (!allowNegative || cursorPosition !== 0 || currentValue.includes('-')) {
        e.preventDefault();

        return;
      }
    }

    const beforeCursor = currentValue.slice(0, cursorPosition ?? 0);
    const afterCursor = currentValue.slice(cursorPosition ?? 0);
    const newValue = beforeCursor + e.key + afterCursor;

    if (newValue === '-' || (!isInteger && newValue === '.')) {
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const processedValue = handleChange(pastedText);

    form.setValue(fieldName, processedValue as PathValue<T, Path<T>>);
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <Input
                {...field}
                data-testid={dataTestId}
                type="number"
                required={required}
                placeholder={placeholder}
                label={formLabel}
                value={field.value ?? ''}
                disabled={disabled}
                size={size}
                error={!!error}
                min={min}
                max={max}
                step={isInteger ? 1 : step}
                onChange={e => {
                  const processedValue = handleChange(e.target.value);

                  field.onChange(processedValue as PathValue<T, Path<T>>);
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </FormControl>
            {!error && <HelperText text={helperText} />}
            {showErrorMessage && <FormMessage className={messageClassName} />}
          </FormItem>
        );
      }}
    />
  );
}
