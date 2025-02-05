import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

import { HelperText } from '../form-fields-base/helper-text';

type FormFieldInputPhoneNumberProps<T extends FieldValues> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  visibled?: boolean;
  size?: 'default';
  required?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message?: string };
  translator?: any;
  onChange?: (value: string) => void;
};

export default function FormFieldInputPhoneNumber<T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName = 'phoneNumber' as Path<T>,
  placeholder = '',
  visibled = true,
  disabled,
  readOnly,
  size = 'default',
  required,
  showErrorMessage = true,
  helperText,
  minLength,
  maxLength,
  pattern,
  translator,
  onChange,
}: FormFieldInputPhoneNumberProps<T>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName as Path<T>}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Input
              {...field}
              dataTestId={dataTestId}
              required={required}
              placeholder={placeholder}
              value={field.value ?? ''}
              disabled={disabled}
              readOnly={readOnly}
              size={size}
              error={!!error}
              maxLength={maxLength}
              onKeyDown={e => {
                if (pattern?.regex) {
                  const char = e.key;

                  if (!pattern.regex.test(char)) {
                    e.preventDefault();

                    return;
                  }
                }
              }}
              onChange={e => {
                const value = e.target.value;

                if (maxLength && value.length > maxLength) return;

                onChange?.(value);
                field.onChange(value);
              }}
            />
          </FormControl>
          {!error && <HelperText text={helperText} />}
          {showErrorMessage && error?.message && (
            <FormMessage className={messageClassName} message={translator?.(error.message, { min: minLength, max: maxLength })} />
          )}
        </FormItem>
      )}
    />
  );
}
