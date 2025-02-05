import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';

import { CharacterCount } from '../form-fields-base/character-count';
import { HelperText } from '../form-fields-base/helper-text';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

type FormFieldTextAreaProps<T extends FieldValues> = {
  dataTestId?: string;
  className?: string;
  inputClassName?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  visibled?: boolean;
  required?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  showCharacterCount?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message?: string };
  translator?: any;
  onChange?: (value: string) => void;
};

export default function FormFieldTextArea<T extends FieldValues>({
  dataTestId,
  className,
  inputClassName,
  messageClassName,
  form,
  formLabel,
  fieldName,
  placeholder = '',
  visibled = true,
  disabled,
  readOnly,
  required,
  showErrorMessage = true,
  helperText,
  showCharacterCount = false,
  minLength,
  maxLength,
  pattern,
  translator,
  onChange,
}: FormFieldTextAreaProps<T>) {
  if (!visibled) return null;

  const inputValue = form.watch(fieldName);
  const shouldShowCount = !helperText && showCharacterCount && maxLength !== undefined;
  const currentLength = inputValue?.length || 0;

  return (
    <FormField
      control={form.control}
      name={fieldName as Path<T>}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className={'scrollbar'}
              inputClassName={inputClassName}
              data-testid={dataTestId}
              required={required}
              placeholder={placeholder}
              value={field.value ?? ''}
              disabled={disabled}
              readOnly={readOnly}
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
            <FormMessage className={messageClassName} message={translator?.(error.message, { min: minLength, max: maxLength })} />
          )}
        </FormItem>
      )}
    />
  );
}
