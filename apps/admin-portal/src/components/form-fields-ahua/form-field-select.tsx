import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Select } from '~react-web-ui-shadcn/components/ahua/select';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

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
  valueField?: Extract<keyof O, string>;
  displayField?: Extract<keyof O, string>;
  size?: 'default' | 'sm';
  required?: boolean;
  multiple?: boolean;
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  showSelectedTags?: boolean;
  showErrorMessage?: boolean;
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
  valueField = 'id' as Extract<keyof O, string>,
  displayField = 'name' as Extract<keyof O, string>,
  size = 'default',
  required,
  multiple = false,
  showSearch = true,
  showClearAll = false,
  showSelectAll = false,
  showSelectedTags = false,
  showErrorMessage = true,
}: FormFieldSelectProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
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
                showSearch={showSearch}
                showClearAll={showClearAll}
                showSelectAll={showSelectAll}
                showSelectedTags={showSelectedTags}
                error={!!error}
                onChange={field.onChange}
              />
            </FormControl>
            {showErrorMessage && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
}
