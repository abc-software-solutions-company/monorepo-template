import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@repo/react-web-ui-shadcn/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';

type FormFieldCheckboxProps<T extends FieldValues> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  label: string;
  disabled?: boolean;
  visibled?: boolean;
  required?: boolean;
  showErrorMessage?: boolean;
};

export default function FormFieldCheckbox<T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  label,
  disabled,
  visibled = true,
  required,
  showErrorMessage = true,
}: FormFieldCheckboxProps<T>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox
                data-testid={dataTestId}
                id={fieldName}
                disabled={disabled}
                required={required}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor={fieldName}>{label}</Label>
            </div>
          </FormControl>
          {showErrorMessage && <FormMessage className={messageClassName} />}
        </FormItem>
      )}
    />
  );
}
