import { lazy, Suspense } from 'react';
import { Editor } from 'ckeditor5';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

import { ComponentBaseProps } from '@/interfaces/component.interface';

const CKEditor = lazy(() => import('@/components/editors/ck-editor'));

type FormFieldCKEditorFullProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  editorRef: React.MutableRefObject<Editor | null>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  minLength?: number;
  maxLength?: number;
} & ComponentBaseProps;

export default function FormFieldCKEditorFull<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'body' as Path<T>,
  editorRef,
  setVisible,
  minLength = 1,
  maxLength = Infinity,
}: FormFieldCKEditorFullProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_content')}</FormLabel>
          <FormControl>
            <Suspense
              fallback={
                <div>
                  <span>Loading editor...</span>
                </div>
              }
            >
              <CKEditor
                {...field}
                minHeight={308}
                value={field.value}
                onChange={field.onChange}
                onFocus={(_event, editor) => (editorRef.current = editor)}
                onShowFileManager={() => setVisible(true)}
              />
            </Suspense>
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
        </FormItem>
      )}
    />
  );
}
