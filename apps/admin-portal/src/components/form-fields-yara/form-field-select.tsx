import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '~react-web-ui-shadcn/components/ui/form';

import Select from '@/components/form-fields-yara/select';

type OptionType = Record<string, string>;

type FormFieldSelectProps<T extends FieldValues, O extends OptionType> = {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  options: O[];
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  valueField: Extract<keyof O, string>;
  displayField: Extract<keyof O, string>;
  size?: 'default' | 'sm';
  required?: boolean;
  multiple?: boolean;
  showSelectedTags?: boolean;
};

export default function FormFieldSelect<T extends FieldValues, O extends OptionType>({
  className,
  form,
  formLabel,
  fieldName,
  options = [],
  placeholder = '',
  visibled = true,
  disabled,
  valueField,
  displayField,
  size = 'default',
  required,
  multiple,
  showSelectedTags = false,
}: FormFieldSelectProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              multiple={multiple}
              required={required}
              className={className}
              placeholder={placeholder}
              label={formLabel}
              valueField={valueField}
              displayField={displayField}
              options={options}
              value={field.value}
              disabled={disabled}
              size={size}
              showSelectedTags={showSelectedTags}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
