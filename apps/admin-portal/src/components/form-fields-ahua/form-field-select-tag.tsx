import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { SelectTag } from '~react-web-ui-shadcn/components/ahua/select-tag';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

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
  valueField?: Extract<keyof O, string>;
  displayField?: Extract<keyof O, string>;
  size?: 'default' | 'sm';
  maxVisible?: number;
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  showErrorMessage?: boolean;
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
  valueField = 'id' as Extract<keyof O, string>,
  displayField = 'name' as Extract<keyof O, string>,
  size = 'default',
  maxVisible,
  showSearch = true,
  showClearAll = false,
  showSelectAll = false,
  showErrorMessage = true,
  required,
}: FormFieldSelectTagProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
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
                showSearch={showSearch}
                showClearAll={showClearAll}
                showSelectAll={showSelectAll}
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
