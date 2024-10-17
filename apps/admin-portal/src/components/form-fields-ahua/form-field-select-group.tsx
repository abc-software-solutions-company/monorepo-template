import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { GroupOption, SelectGroup } from '~react-web-ui-shadcn/components/ahua/select-group';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

type OptionType = Record<string, string>;

type StringKeyOf<T> = Extract<keyof T, string>;

type FormFieldSelectGroupProps<T extends FieldValues, O extends OptionType> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  options: GroupOption<O>[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  visibled?: boolean;
  valueField?: StringKeyOf<O>;
  displayField?: StringKeyOf<O>;
  size?: 'default' | 'sm';
  required?: boolean;
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  showSelectedTags?: boolean;
  showErrorMessage?: boolean;
  labelClassName?: string;
  loading?: boolean;
  onSearch?: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onLoadMore?: () => void;
  onChange?: (value: unknown[]) => void;
};

export default function FormFieldSelectGroup<T extends FieldValues, O extends OptionType>({
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
  valueField = 'id' as StringKeyOf<O>,
  displayField = 'name' as StringKeyOf<O>,
  size = 'default',
  required,
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
}: FormFieldSelectGroupProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <SelectGroup
                {...field}
                dataTestId={dataTestId}
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
                required={required}
                error={!!error}
                loading={loading}
                onChange={(value: unknown[]) => {
                  field.onChange(value as O[]);
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
