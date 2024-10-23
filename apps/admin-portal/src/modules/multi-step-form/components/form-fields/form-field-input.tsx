import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '~react-web-ui-shadcn/components/ui/form';

import { Input } from '@/components/input';

type FormFieldInputProps<T extends FieldValues> = {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  size?: 'default' | 'sm';
  multiple?: boolean;
  required?: boolean;
};

export default function FormFieldInput<T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName,
  placeholder = '',
  visibled = true,
  disabled,
  size = 'default',
  multiple,
  required,
}: FormFieldInputProps<T>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              multiple={multiple}
              required={required}
              className={className}
              placeholder={placeholder}
              label={formLabel}
              value={field.value}
              disabled={disabled}
              inputSize={size}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
