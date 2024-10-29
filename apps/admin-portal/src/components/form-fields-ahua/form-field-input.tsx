import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Input } from '~react-web-ui-shadcn/components/ahua/input';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

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
      render={({ field, fieldState: { error } }) => (
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
              size={size}
              error={!!error}
              onChange={field.onChange}
            />
          </FormControl>
          {error?.message && <FormMessage message={error.message} />}
        </FormItem>
      )}
    />
  );
}
