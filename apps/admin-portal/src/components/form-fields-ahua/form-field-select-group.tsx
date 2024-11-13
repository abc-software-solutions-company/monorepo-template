import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { GroupOption, SelectGroup } from '~react-web-ui-shadcn/components/ahua/select-group';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

type BaseOption = Record<string, string>;

type StringKeyOf<T> = Extract<keyof T, string>;

type FormFieldSelectGroupProps<T extends FieldValues, O extends BaseOption> = {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  options: GroupOption<O>[];
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  valueField?: StringKeyOf<O>;
  displayField?: StringKeyOf<O>;
  size?: 'default' | 'sm';
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  showSelectedTags?: boolean;
  showGroupNameWhenEmpty?: boolean;
  showErrorMessage?: boolean;
  required?: boolean;
  labelClassName?: string;
};

export default function FormFieldSelectGroup<T extends FieldValues, O extends BaseOption>({
  className,
  form,
  formLabel,
  fieldName,
  options = [],
  placeholder = '',
  visibled = true,
  disabled,
  valueField = 'id' as StringKeyOf<O>,
  displayField = 'name' as StringKeyOf<O>,
  size = 'default',
  showSearch = true,
  showClearAll = false,
  showSelectAll = false,
  showSelectedTags = false,
  showErrorMessage = true,
  required,
  showGroupNameWhenEmpty,
}: FormFieldSelectGroupProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem>
            <FormControl>
              <SelectGroup
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
                showGroupNameWhenEmpty={showGroupNameWhenEmpty}
                required={required}
                error={!!error}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </FormControl>
            {showErrorMessage && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
}
