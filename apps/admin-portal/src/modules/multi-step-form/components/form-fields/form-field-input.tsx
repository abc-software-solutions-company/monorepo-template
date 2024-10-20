import classNames from 'classnames';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type FormFieldInputProps<T extends FieldValues> = {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  minLength?: number;
  maxLength?: number;
} & ComponentBaseProps;

export default function FormFieldInput<T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName = 'name' as Path<T>,
  placeholder = '',
  disabled,
  visibled = true,
}: FormFieldInputProps<T>) {
  if (!visibled) return null;

  return (
    <Controller
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <div className={classNames('grid gap-2', className)}>
          {formLabel && <label className="font-bold">{formLabel}</label>}
          <input className="border p-2" {...field} placeholder={placeholder} disabled={disabled} />
          {error?.message && <p className="text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
