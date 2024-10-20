import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Controller, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type RadioItem = {
  id: string;
  label: string;
};

type FormFieldRadioBlockProps<T extends FieldValues> = {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  items?: RadioItem[];
  disabled?: boolean;
  visibled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
} & ComponentBaseProps;

export default function FormFieldRadioBlock<T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName,
  items = [],
  disabled,
  visibled = true,
  defaultValue,
}: FormFieldRadioBlockProps<T>) {
  const { control, setValue } = form;

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(fieldName, defaultValue, { shouldValidate: true });
    }
  }, [defaultValue, fieldName, setValue]);

  if (!visibled) return null;

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <div className={classNames('grid gap-2', className)}>
          {formLabel && <label className="font-bold">{formLabel}</label>}
          <div className="grid gap-2">
            {items?.map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  type="radio"
                  id={`${fieldName}-${item.id}`}
                  {...field}
                  value={item.id}
                  checked={field.value === item.id}
                  disabled={disabled}
                  className="mr-2"
                  onChange={e => {
                    field.onChange(e);
                    setValue(fieldName, e.target.value as PathValue<T, Path<T>>, { shouldValidate: true });
                  }}
                />
                <label htmlFor={`${fieldName}-${item.id}`}>{item.label}</label>
              </div>
            ))}
          </div>
          {error?.message && <p className="text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
