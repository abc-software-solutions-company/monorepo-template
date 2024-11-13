import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputDateRange } from '~react-web-ui-shadcn/components/ahua/input-date-range';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

interface IFormFieldDateRangePickerProps<T extends FieldValues> {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  size?: 'default' | 'sm';
  required?: boolean;
  disableBefore?: Date;
}

const FormFieldDateRangePicker = <T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName,
  placeholder,
  disabled = false,
  visibled = true,
  size = 'default',
  required = false,
  disableBefore,
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
                label={formLabel}
                value={field.value}
                placeholder={placeholder}
                disabled={disabled}
                size={size}
                required={required}
                error={!!error}
                disableBefore={disableBefore}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldDateRangePicker;
