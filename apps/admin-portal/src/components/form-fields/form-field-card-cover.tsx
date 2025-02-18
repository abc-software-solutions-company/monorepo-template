import { useState } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';

import { IMAGE_THUMBNAIL_URL } from '@/constants/file.constant';

import ButtonRemoveFile from '@/components/button-remove-file';
import ButtonSelectFile from '@/components/button-select-file';

import FileDialog from '@/modules/files/components/file-dialog';

type FormFieldCardCoverProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  maxLength?: number;
};

export default function FormFieldCardCover<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'cover' as Path<T>,
  maxLength = 1000,
}: FormFieldCardCoverProps<T>) {
  const t = useTranslations();
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{formLabel ?? t('form_field_image')}</CardTitle>
          <ButtonSelectFile onClick={() => setIsFileManagerVisible(true)} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field, fieldState: { error } }) => (
            <>
              <FormItem>
                <FormControl>
                  <Input readOnly {...field} className="hidden" />
                </FormControl>
                {field.value && (
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      className="aspect-video w-full object-cover"
                      src={IMAGE_THUMBNAIL_URL + field.value}
                      alt={field.value}
                      height="100"
                      width="100"
                    />
                    <ButtonRemoveFile onClick={() => form.setValue(fieldName, '' as PathValue<T, Path<T>>)} />
                  </div>
                )}
                {error?.message && <FormMessage message={t(error.message, { max: maxLength })} />}
              </FormItem>
              {!field.value && <ButtonSelectFile className="w-full py-12" onClick={() => setIsFileManagerVisible(true)} />}
            </>
          )}
        />
        <FileDialog
          visible={isFileManagerVisible}
          type={'single'}
          mime="image/"
          selectedItems={[]}
          onCancel={() => setIsFileManagerVisible(false)}
          onSelectClick={files => {
            if (files.length > 0 && files[0]) {
              form.setValue(fieldName, files[0].uniqueName as PathValue<T, Path<T>>);
              setIsFileManagerVisible(false);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
