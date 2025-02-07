import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { IInputProps, Input } from '@repo/react-web-ui-shadcn/components/ahua/input';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';

import { HelperText } from '../form-fields-base/helper-text';
import { AutocompleteTypes } from '@repo/shared-web/interfaces/autocomplete.interface';

interface FormFieldInputNumberProps<T extends FieldValues> extends Omit<IInputProps, 'form' | 'onChange' | 'pattern'> {
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  visible?: boolean;
  required?: boolean;
  autoComplete?: AutocompleteTypes;
  showErrorMessage?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  translator?: any;
  onChange?: (value: string) => void;
}

export default function FormFieldInputNumber<T extends FieldValues>({
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  placeholder = '',
  visible = true,
  disabled,
  readOnly,
  size = 'default',
  required,
  autoComplete = 'off',
  showErrorMessage = true,
  helperText,
  minLength,
  maxLength = 10,
  min,
  max,
  allowDecimal = false,
  allowNegative = false,
  translator,
  onChange,
}: FormFieldInputNumberProps<T>) {
  const t = useTranslations();

  if (!visible) return null;

  const getValidationPattern = (maxLength: number, allowDecimal: boolean, allowNegative: boolean): string => {
    let pattern = `^${allowNegative ? '-?' : ''}\\d{1,${maxLength}}`;
    if (allowDecimal) {
      pattern += `(\\.\\d{0,${maxLength - 1}})?`;
    }
    return pattern + '$';
  };

  const validateNumberLength = (value: string, maxLength: number): boolean => {
    const [integerPart] = value.split('.');
    const integerLength = integerPart.replace('-', '').length;
    if (integerLength > maxLength) return false;

    const numericLength = value.replace(/[-\.]/g, '').length;
    return numericLength <= maxLength;
  };

  const validateNumberBounds = (value: string, min?: number, max?: number): boolean => {
    const numValue = Number(value);
    if (isNaN(numValue)) return true;
    if (min !== undefined && numValue < min) return false;
    if (max !== undefined && numValue > max) return false;
    return true;
  };

  const validateNumberInput = (value: string): boolean => {
    if (value === '' || (allowNegative && value === '-')) return true;

    const pattern = getValidationPattern(maxLength, allowDecimal, allowNegative);
    const regex = new RegExp(pattern);
    if (!regex.test(value)) return false;

    return validateNumberLength(value, maxLength) && validateNumberBounds(value, min, max);
  };

  const adjustValueToBounds = (value: string, field: ControllerRenderProps<T, Path<T>>): void => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return;

    let adjustedValue = numericValue;
    if (min !== undefined && numericValue < min) adjustedValue = min;
    if (max !== undefined && numericValue > max) adjustedValue = max;

    if (adjustedValue !== numericValue) {
      const stringValue = adjustedValue.toString();
      field.onChange(adjustedValue);
      onChange?.(stringValue);
    } else {
      onChange?.(value);
      field.onChange(numericValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: ControllerRenderProps<T, Path<T>>): void => {
    const currentValue = field.value?.toString() || '';
    const input = e.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;

    if (!allowDecimal && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && min !== undefined && max !== undefined) {
      e.preventDefault();
      const numValue = Number(currentValue) || 0;
      const step = e.key === 'ArrowUp' ? 1 : -1;
      const newValue = Math.min(Math.max(numValue + step, min), max);
      field.onChange(newValue);
      onChange?.(newValue.toString());
      return;
    }

    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;

    if (e.key === '-') {
      if (!allowNegative || cursorPosition !== 0 || currentValue.includes('-') || (min !== undefined && min >= 0)) {
        e.preventDefault();
      }
      return;
    }

    if (e.key === '.') {
      if (!allowDecimal || currentValue.includes('.') || currentValue === '' || currentValue === '-') {
        e.preventDefault();
      }
      return;
    }

    if (/^\d$/.test(e.key)) {
      const newValue = currentValue.slice(0, cursorPosition) + e.key + currentValue.slice(cursorPosition);
      if (!validateNumberInput(newValue)) {
        e.preventDefault();
      }
    } else if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  };

  const handleChange = (value: string, field: ControllerRenderProps<T, Path<T>>): void => {
    if (value === '' || (allowNegative && value === '-')) {
      onChange?.(value);
      field.onChange(value === '' ? null : value);
      return;
    }

    if (validateNumberInput(value)) {
      adjustValueToBounds(value, field);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, field: ControllerRenderProps<T, Path<T>>): void => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    if (validateNumberInput(pastedText)) {
      adjustValueToBounds(pastedText, field);
    }
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormControl>
            <Input
              {...field}
              autoComplete={autoComplete}
              required={required}
              placeholder={placeholder}
              label={formLabel}
              value={field.value ?? ''}
              disabled={disabled}
              readOnly={readOnly}
              size={size}
              error={!!error}
              onKeyDown={e => handleKeyDown(e, field)}
              onChange={e => handleChange(e.target.value, field)}
              onPaste={e => handlePaste(e, field)}
            />
          </FormControl>
          {!error && <HelperText text={helperText} />}
          {showErrorMessage && error?.message && (
            <FormMessage
              className={messageClassName}
              message={translator ? translator?.(error.message, { min: minLength, max: maxLength }) : error.message}
            />
          )}
        </FormItem>
      )}
    />
  );
}
