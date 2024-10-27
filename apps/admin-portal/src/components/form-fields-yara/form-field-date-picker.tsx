import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

import { InputDate } from '@/components/form-fields-yara/input-date';

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
              label={formLabel ?? t('form_field_date_picker')}
              value={field.value}
              error={!!error}
              placeholder={placeholder}
              disabled={disabled}
              size={size}
              required={required}
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
