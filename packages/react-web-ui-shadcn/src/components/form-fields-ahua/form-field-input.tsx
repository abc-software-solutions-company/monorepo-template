import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Input } from '@repo/react-web-ui-shadcn/components/ahua/input';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';

import { CharacterCount } from '../form-fields-base/character-count';
import { HelperText } from '../form-fields-base/helper-text';

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
  minLength?: number;
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
  minLength,
  maxLength,
  pattern,
  onChange,
}: FormFieldInputProps<T>) {
  const t = useTranslations();

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
            {!error && (
              <>
                <HelperText text={helperText} />
                <CharacterCount current={currentLength} max={maxLength} visibled={shouldShowCount} />
              </>
            )}
            {showErrorMessage && error?.message && (
              <FormMessage className={messageClassName} message={t(error.message, { min: minLength, max: maxLength })} />
            )}
          </FormItem>
        );
      }}
    />
  );
}
