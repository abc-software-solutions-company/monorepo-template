import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@repo/react-web-ui-shadcn/components/ui/radio-group';

type Option = {
  label: string;
  value: string;
  description?: string;
};

type FormFieldRadioProps<T extends FieldValues> = {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  options: Option[];
  disabled?: boolean;
  visibled?: boolean;
  required?: boolean;
  showErrorMessage?: boolean;
  defaultValue?: string;
};

export default function FormFieldRadio<T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  options,
  disabled,
  visibled = true,
  required,
  showErrorMessage = true,
  defaultValue,
}: FormFieldRadioProps<T>) {
  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <RadioGroup
              data-testid={dataTestId}
              className="flex items-center space-x-2"
              defaultValue={defaultValue}
              value={field.value}
              disabled={disabled}
              required={required}
              onValueChange={field.onChange}
            >
              {options.map(option => (
                <div key={option.value} className="relative flex items-center space-x-1.5">
                  <RadioGroupItem value={option.value} id={`${fieldName}-${option.value}`} />
                  <Label htmlFor={`${fieldName}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {showErrorMessage && <FormMessage className={messageClassName} />}
        </FormItem>
      )}
    />
  );
}
