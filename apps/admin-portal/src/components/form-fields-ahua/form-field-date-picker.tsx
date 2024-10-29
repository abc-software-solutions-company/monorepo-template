import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { InputDate } from '~react-web-ui-shadcn/components/ahua/input-date';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

type FormFieldDatePickerProps<T extends FieldValues> = {
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
};

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
  disableBefore,
}: FormFieldDatePickerProps<T>) => {
  const t = useTranslations();

  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormControl>
            <InputDate
              label={formLabel}
              value={field.value}
              error={!!error}
              placeholder={placeholder}
              disabled={disabled}
              size={size}
              required={required}
              disableBefore={disableBefore}
              onChange={field.onChange}
            />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message)} />}
        </FormItem>
      )}
    />
  );
};

export default FormFieldDatePicker;
