import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { OptionType, SelectTag, SelectTagProps } from '@repo/react-web-ui-shadcn/components/ahua/select-tag';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { HelperText } from '../form-fields-base/helper-text';

type StringKeyOf<T> = Extract<keyof T, string>;

type FormFieldSelectTagProps<T extends FieldValues, O extends OptionType> = Omit<
  SelectTagProps<O>,
  'form' | 'onChange' | 'value' | 'valueField' | 'displayField'
> & {
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  options: O[];
  visibled?: boolean;
  valueField?: StringKeyOf<O>;
  displayField?: StringKeyOf<O>;
  size?: 'default' | 'sm';
  required?: boolean;
  showErrorMessage?: boolean;
  helperText?: string;
  translator?: any;
  onChange?: (value: unknown[]) => void;
};

export default function FormFieldSelectTag<T extends FieldValues, O extends OptionType>({
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  labelDisplay = 'inside',
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
  helperText,
  maxVisible,
  loading = false,
  translator,
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
                required={required}
                placeholder={placeholder}
                label={formLabel}
                labelDisplay={labelDisplay}
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
            {!error && <HelperText text={helperText} />}
            {showErrorMessage && error?.message && (
              <FormMessage className={messageClassName} message={translator ? translator(error.message || '') : error.message} />
            )}
          </FormItem>
        );
      }}
    />
  );
}
