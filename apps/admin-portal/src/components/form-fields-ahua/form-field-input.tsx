import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Input } from '~react-web-ui-shadcn/components/ahua/input';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

import { CharacterCount, HelperText } from './form-field-base';

type FormFieldInputProps<T extends FieldValues> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  visibled?: boolean;
  size?: 'default' | 'sm';
  multiple?: boolean;
  required?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  pattern?: {
    regex: RegExp;
    message?: string;
  };
  onChange?: (value: string) => void;
};

export default function FormFieldInput<T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  placeholder = '',
  visibled = true,
  disabled,
  readOnly,
  size = 'default',
  multiple,
  required,
  showErrorMessage = true,
  helperText,
  showCharacterCount = false,
  maxLength,
  pattern,
  onChange,
}: FormFieldInputProps<T>) {
  if (!visibled) return null;

  const inputValue = form.watch(fieldName);
  const shouldShowCount = !helperText && showCharacterCount && maxLength !== undefined;
  const currentLength = inputValue?.length || 0;

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
                dataTestId={dataTestId}
                multiple={multiple}
                required={required}
                placeholder={placeholder}
                label={formLabel}
                value={field.value ?? ''}
                disabled={disabled}
                readOnly={readOnly}
                size={size}
                error={!!error}
                maxLength={maxLength}
                onChange={e => {
                  const value = e.target.value;

                  if (maxLength && value.length > maxLength) return;

                  if (pattern?.regex && value) {
                    const isValid = pattern.regex.test(value);

                    if (!isValid) return;
                  }

                  onChange?.(value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            {!error && (
              <>
                <HelperText text={helperText} />
                <CharacterCount current={currentLength} max={maxLength} visibled={shouldShowCount} />
              </>
            )}
            {showErrorMessage && <FormMessage className={messageClassName} />}
          </FormItem>
        );
      }}
    />
  );
}
