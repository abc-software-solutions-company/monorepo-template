import { useCallback, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import { FieldArray, FieldArrayPath, FieldValues, Path, useFieldArray, UseFormReturn } from 'react-hook-form';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';

import { IMAGE_BASE_URL } from '@/constants/file.constant';

import ButtonRemoveFile from '@/components/button-remove-file';
import ButtonSelectFile from '@/components/button-select-file';

import FileDialog from '@/modules/files/components/file-dialog';
import { FileEntity } from '@/modules/files/interfaces/files.interface';

type FormFieldCardImagesProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: FieldArrayPath<T>;
};

export default function FormFieldCardImages<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'images' as FieldArrayPath<T>,
}: FormFieldCardImagesProps<T>) {
  const t = useTranslations();
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: fieldName });

  const onSortableEnd = useCallback(
    (event: SortableEvent) => {
      if (event.oldIndex !== undefined && event.newIndex !== undefined) {
        move(event.oldIndex, event.newIndex);
      }
    },
    [move]
  );

  const onSelectClick = useCallback(
    (items: FileEntity[]) => {
      items.forEach(item => {
        if (item) append(item as unknown as FieldArray<T>);
      });
      setIsFileManagerVisible(false);
    },
    [append, setIsFileManagerVisible]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{formLabel ?? t('form_field_images')}</CardTitle>
          <ButtonSelectFile onClick={() => setIsFileManagerVisible(true)} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {fields.length > 0 && (
          <ReactSortable animation={100} className="grid grid-cols-3 gap-2" list={fields} setList={() => {}} onEnd={onSortableEnd}>
            {fields.map((image, index) => {
              const fileEntity = image as unknown as FileEntity;

              const ext = fileEntity.uniqueName.split('.').pop() as string;

              return (
                <div key={fileEntity.id}>
                  <FormField
                    control={form.control}
                    name={`${fieldName}.${index}.id` as Path<T>}
                    render={({ field, fieldState: { error } }) => {
                      let component = null;

                      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
                        component = (
                          <div>
                            <img
                              className="aspect-square w-full object-cover"
                              src={IMAGE_BASE_URL + fileEntity.uniqueName}
                              alt={fileEntity.name}
                              height="112"
                              width="112"
                            />
                          </div>
                        );
                      }

                      if (['webm', 'mp4', 'avi'].includes(ext)) {
                        component = (
                          <div className="relative">
                            <video
                              className="aspect-square w-full object-cover"
                              src={IMAGE_BASE_URL + fileEntity.uniqueName}
                              height="112"
                              width="112"
                            />
                            <PlayIcon size={16} className="absolute left-1 top-1 text-primary" />
                          </div>
                        );
                      }

                      return (
                        <FormItem>
                          <FormControl>
                            <Input readOnly {...field} className="hidden" />
                          </FormControl>
                          <div className="relative overflow-hidden rounded-md">
                            {component}
                            <ButtonRemoveFile onClick={() => remove(index)} />
                          </div>
                          {error?.message && <FormMessage message={t(error.message)} />}
                        </FormItem>
                      );
                    }}
                  />
                </div>
              );
            })}
          </ReactSortable>
        )}
        {fields.length === 0 && (
          <div className="grid grid-cols-3 gap-2">
            <ButtonSelectFile className="aspect-square" onClick={() => setIsFileManagerVisible(true)} />
          </div>
        )}
        <FileDialog
          visible={isFileManagerVisible}
          type={'multiple'}
          selectedItems={[]}
          onCancel={() => setIsFileManagerVisible(false)}
          onSelectClick={onSelectClick}
        />
      </CardContent>
    </Card>
  );
}
