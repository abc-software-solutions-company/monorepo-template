import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '~react-web-ui-shadcn/components/ui/form';

import SelectTag from '@/components/form-fields-yara/select-tag';

type OptionType = Record<string, string>;

type FormFieldSelectTagProps<T extends FieldValues, O extends OptionType> = {
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
  maxVisible?: number;
  multiple?: boolean;
  required?: boolean;
};

export default function FormFieldSelectTag<T extends FieldValues, O extends OptionType>({
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
  maxVisible,
  required,
}: FormFieldSelectTagProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <SelectTag
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
              maxVisible={maxVisible}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
