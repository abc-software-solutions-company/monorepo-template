import { useEffect } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';
import { toSlug } from '@repo/shared-universal/utils/string.util';

type FormFieldInputSlugProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  watchFieldName?: Path<T>;
  minLength?: number;
  maxLength?: number;
};

export default function FormFieldInputSlug<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'slug' as Path<T>,
  watchFieldName = 'name' as Path<T>,
  minLength = 1,
  maxLength = 255,
}: FormFieldInputSlugProps<T>) {
  const t = useTranslations();
  const nameValue = useWatch({ control: form.control, name: watchFieldName });

  useEffect(() => {
    const slugValue = toSlug(nameValue) as PathValue<T, Path<T>>;

    form.setValue(fieldName, slugValue);
    form.formState.isSubmitted && form.trigger(fieldName);
  }, [nameValue, form, fieldName]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_slug')}</FormLabel>
          <FormControl>
            <Input {...field} error={!!error} />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
        </FormItem>
      )}
    />
  );
}
