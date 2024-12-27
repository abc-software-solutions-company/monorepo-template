import { Locale } from 'date-fns';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputDateRange } from '~react-web-ui-shadcn/components/ahua/input-date-range';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

interface IFormFieldDateRangePickerProps<T extends FieldValues> {
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
  disableBefore?: Date;
  dateFormat?: string;
  locale?: Locale;
}

const FormFieldDateRangePicker = <T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
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
}: IFormFieldDateRangePickerProps<T>) => {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <InputDateRange
                {...field}
                data-testid={dataTestId}
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
              />
            </FormControl>
            {showErrorMessage && <FormMessage className={messageClassName} />}
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldDateRangePicker;
