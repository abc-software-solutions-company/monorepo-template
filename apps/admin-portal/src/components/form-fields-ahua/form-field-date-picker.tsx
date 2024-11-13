import { Locale } from 'date-fns';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputDate } from '~react-web-ui-shadcn/components/ahua/input-date';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

interface IFormFieldDatePickerProps<T extends FieldValues> {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  size?: 'default' | 'sm';
  required?: boolean;
  showErrorMessage?: boolean;
  disableBefore?: Date;
  dateFormat?: string;
  locale?: Locale;
}

const FormFieldDatePicker = <T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName,
  placeholder,
  disabled = false,
  visibled = true,
  size = 'default',
  required = false,
  showErrorMessage = true,
  disableBefore,
  dateFormat,
  locale,
}: IFormFieldDatePickerProps<T>) => {
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
                locale={locale}
                label={formLabel}
                value={field.value}
                placeholder={placeholder}
                disabled={disabled}
                size={size}
                required={required}
                error={!!error}
                disableBefore={disableBefore}
                dateFormat={dateFormat}
                onChange={field.onChange}
              />
            </FormControl>
            {showErrorMessage && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldDatePicker;
