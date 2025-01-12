import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { SelectTag } from '@repo/react-web-ui-shadcn/components/ahua/select-tag';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';

type OptionType = Record<string, string>;

type FormFieldSelectTagProps<T extends FieldValues, O extends OptionType> = {
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
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  showErrorMessage?: boolean;
  maxVisible?: number;
  multiple?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  onSearch?: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onLoadMore?: () => void;
  onChange?: (value: unknown[]) => void;
};

export default function FormFieldSelectTag<T extends FieldValues, O extends OptionType>({
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
  showSearch = true,
  showClearAll = false,
  showSelectAll = false,
  showErrorMessage = true,
  maxVisible,
  loading = false,
  onSearch,
  onFocus,
  onLoadMore,
  onChange,
}: FormFieldSelectTagProps<T, O>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <SelectTag
                {...field}
                dataTestId={dataTestId}
                required={required}
                placeholder={placeholder}
                label={formLabel}
                valueField={valueField}
                displayField={displayField}
                options={options}
                value={field.value ?? []}
                disabled={disabled}
                readOnly={readOnly}
                size={size}
                maxVisible={maxVisible}
                showSearch={showSearch}
                showClearAll={showClearAll}
                showSelectAll={showSelectAll}
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
