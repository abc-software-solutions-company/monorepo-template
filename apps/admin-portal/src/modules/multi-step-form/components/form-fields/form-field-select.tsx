import classNames from 'classnames';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type SelectItem = {
  id: string;
  label: string;
};

type FormFieldSelectProps<T extends FieldValues> = {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  items?: SelectItem[];
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
} & ComponentBaseProps;

export default function FormFieldSelect<T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName = 'defaultFieldName' as Path<T>,
  items = [],
  placeholder = 'Select item',
  disabled,
  visibled = true,
}: FormFieldSelectProps<T>) {
  if (!visibled) return null;

  return (
    <Controller
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <div className={classNames('grid gap-2', className)}>
          {formLabel && <label className="font-bold">{formLabel}</label>}
          <select className="border p-2" value={field.value} disabled={disabled} onChange={field.onChange}>
            <option value="">{placeholder}</option>
            {items?.map(item => {
              return (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              );
            })}
          </select>
          {error?.message && <p className="text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
