import { lazy, Suspense } from 'react';
import { Editor } from 'ckeditor5';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';

import { ComponentBaseProps } from '@/interfaces/component.interface';

const CKEditor = lazy(() => import('@/components/editors/ck-editor'));

type FormFieldCKEditorSimpleProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  editorRef: React.MutableRefObject<Editor | null>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  minLength?: number;
  maxLength?: number;
} & ComponentBaseProps;

export default function FormFieldCKEditorSimple<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'description' as Path<T>,
  editorRef,
  setVisible,
  minLength = 1,
  maxLength = 2000,
}: FormFieldCKEditorSimpleProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_description')}</FormLabel>
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
                toolbar={['bold', 'italic', 'underline', 'strikethrough']}
                minHeight={100}
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
