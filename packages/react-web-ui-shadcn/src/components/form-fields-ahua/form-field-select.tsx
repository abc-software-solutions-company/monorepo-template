import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Select } from '~react-web-ui-shadcn/components/ahua/select';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

type OptionType = Record<string, string>;

type FormFieldSelectProps<T extends FieldValues, O extends OptionType> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  options: O[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
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
  loading?: boolean;
  hasMore?: boolean;
  onSearch?: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onLoadMore?: () => void;
  onChange?: (value: unknown | unknown[]) => void;
};

export default function FormFieldSelect<T extends FieldValues, O extends OptionType>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  options = [],
  placeholder = '',
  visibled = true,
  disabled,
  readOnly,
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
  loading = false,
  onSearch,
  onFocus,
  onLoadMore,
  onChange,
}: FormFieldSelectProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <Select
                {...field}
                dataTestId={dataTestId}
                multiple={multiple}
                required={required}
                placeholder={placeholder}
                label={formLabel}
                valueField={valueField}
                displayField={displayField}
                options={options}
                value={field.value}
                disabled={disabled}
                readOnly={readOnly}
                size={size}
                showSearch={showSearch}
                showClearAll={showClearAll}
                showSelectAll={showSelectAll}
                showSelectedTags={showSelectedTags}
                error={!!error}
                loading={loading}
                onChange={(value: unknown | unknown[]) => {
                  if (multiple) {
                    field.onChange(value as O[]);
                  } else {
                    field.onChange(value as string);
                  }
                  onChange?.(value);
                }}
                onSearch={onSearch}
                onFocus={onFocus}
                onLoadMore={onLoadMore}
              />
            </FormControl>
            {showErrorMessage && <FormMessage className={messageClassName} />}
          </FormItem>
        );
      }}
    />
  );
}
