import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputDate, InputDateProps } from '@repo/react-web-ui-shadcn/components/ahua/input-date';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { HelperText } from '../form-fields-base/helper-text';

interface IFormFieldInputDatePickerProps<T extends FieldValues> extends Omit<InputDateProps, 'form' | 'onChange'> {
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  visibled?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  translator?: any;
  onChange?: (date?: Date) => void;
}

const FormFieldInputDatePicker = <T extends FieldValues>({
  className,
  messageClassName,
  labelDisplay = 'inside',
  form,
  formLabel,
  fieldName,
  placeholder,
  disabled = false,
  visibled = true,
  size = 'default',
  required = false,
  showErrorMessage = true,
  helperText,
  disableBefore,
  dateFormat,
  locale,
  translator,
  onChange,
}: IFormFieldInputDatePickerProps<T>) => {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <InputDate
                {...field}
                locale={locale}
                label={formLabel}
                labelDisplay={labelDisplay}
                value={field.value}
                placeholder={placeholder}
                disabled={disabled}
                size={size}
                required={required}
                error={!!error}
                disableBefore={disableBefore}
                dateFormat={dateFormat}
                onChange={date => {
                  field.onChange(date);
                  onChange?.(date);
                }}
              />
            </FormControl>
            {!error && <HelperText text={helperText} />}
            {showErrorMessage && error?.message && (
              <FormMessage className={messageClassName} message={translator ? translator(error.message || '') : error.message} />
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldInputDatePicker;
