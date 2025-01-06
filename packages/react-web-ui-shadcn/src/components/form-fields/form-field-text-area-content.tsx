import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Textarea } from '~react-web-ui-shadcn/components/ui/textarea';

type FormFieldTextAreaContentProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  minLength?: number;
  maxLength?: number;
};

export default function FormFieldTextAreaContent<T extends FieldValues>({
  form,
  formLabel,
  fieldName,
  minLength = 1,
  maxLength = 2000,
}: FormFieldTextAreaContentProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_description')}</FormLabel>
          <FormControl>
            <Textarea className="scrollbar" {...field} />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
        </FormItem>
      )}
    />
  );
}
