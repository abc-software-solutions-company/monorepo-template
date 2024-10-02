import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '~react-web-ui-shadcn/components/ui/form';
import { Input } from '~react-web-ui-shadcn/components/ui/input';
import { cn } from '~react-web-ui-shadcn/lib/utils';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import ButtonRemoveFile from '@/components/button-remove-file';
import ButtonSelectFile from '@/components/button-select-file';

import FileDialog from '@/modules/files/components/file-dialog';
import { getFileContent } from '@/modules/files/components/file-item';
import { FileEntity } from '@/modules/files/interfaces/files.interface';

type FormFieldFileProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  maxLength?: number;
  initialFile?: FileEntity | null;
  size?: 'square' | 'video' | 'book'; // Added size prop
} & ComponentBaseProps;

export default function FormFieldFile<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'file' as Path<T>,
  initialFile,
  disabled,
  size = 'video',
  className,
}: FormFieldFileProps<T>) {
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const [file, setFile] = useState<FileEntity | null | undefined>(initialFile);

  useEffect(() => {
    if (!initialFile) return;
    setFile(initialFile);
  }, [initialFile]);

  const aspectRatioMap = {
    square: 'aspect-square', // Square aspect ratio for small
    video: 'aspect-video', // Video aspect ratio for medium
    book: 'aspect-[137/218]', // Widescreen aspect ratio for large
  };
  const aspectClass = aspectRatioMap[size]; // Default to medium aspect ratio

  return (
    <div className={cn('flex h-full w-full flex-col gap-2', className)}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => {
          return (
            <>
              <FormItem className="relative">
                <FormLabel className="font-bold">{formLabel}</FormLabel>
                <FormControl>
                  <Input readOnly disabled={disabled} {...field} className="hidden" />
                </FormControl>
                {file && (
                  <div className="flex flex-col items-center gap-2">
                    {getFileContent(file)}
                    <p>{file.uniqueName}</p>
                  </div>
                )}
                <ButtonRemoveFile
                  disabled={disabled} // Disable button if disabled prop is true
                  onClick={() => {
                    form.setValue(fieldName, '' as PathValue<T, Path<T>>);
                    setFile(null);
                  }}
                />
              </FormItem>
              {!field.value && (
                <ButtonSelectFile
                  disabled={disabled} // Keep the disabled state
                  className={classNames('grow rounded-full py-12', aspectClass, disabled && 'opacity-50')}
                  onClick={() => setIsFileManagerVisible(true)}
                />
              )}
            </>
          );
        }}
      />
      <FileDialog
        visible={isFileManagerVisible}
        type={'single'}
        selectedItems={[]}
        onCancel={() => setIsFileManagerVisible(false)}
        onSelectClick={files => {
          if (files.length > 0 && files[0]) {
            setFile(files[0]);
            form.setValue(fieldName, files[0].id as PathValue<T, Path<T>>);
            setIsFileManagerVisible(false);
          }
        }}
      />
    </div>
  );
}
