import { useState } from 'react';
import { AlertCircle, ChevronDown, Trash2Icon } from 'lucide-react';
import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import FileUpload from '~react-web-ui-shadcn/components/ahua/file-upload';
import { Alert, AlertDescription } from '~react-web-ui-shadcn/components/ui/alert';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '~react-web-ui-shadcn/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { convertBytes } from '~shared-universal/utils/string.util';

import { Locale, TranslationValue } from '@/interfaces/language.interface';

import { CheckIndicator } from './form-field-base';

import ModalConfirm from '../modals/modal-confirm';

export type FilePreview = {
  name: string;
  size: number;
  type: string;
  url?: string;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

export type FileValidationError = {
  message: string;
  files: string[];
};

interface IFormFieldUploaderMultiLanguageProps<T extends FieldValues> {
  className?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  locales: Locale[];
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  required?: boolean;
  maxVisible?: number;
  maxSize?: number;
  imageDimensions?: ImageDimensions;
  maxFiles?: number;
  previews: Record<string, FilePreview[]>;
  isUploading?: boolean;
  onSelectFile: (field: ControllerRenderProps<T, Path<T>>, lang: string, files: File[], filenames: string[]) => void;
  onRemoveFile: (field: ControllerRenderProps<T, Path<T>>, lang: string) => void;
}

export default function FormFieldUploaderMultiLanguage<T extends FieldValues>({
  className,
  form,
  formLabel,
  fieldName,
  locales,
  visibled = true,
  disabled,
  required,
  maxVisible = 4,
  maxSize = 5242880,
  imageDimensions,
  maxFiles = 1,
  previews,
  isUploading = false,
  onSelectFile,
  onRemoveFile,
}: IFormFieldUploaderMultiLanguageProps<T>) {
  const sortedLocales = [...locales].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.languageLabel.localeCompare(b.languageLabel)));
  const defaultLocale = sortedLocales.find(locale => locale.isDefault);

  const [activeLocale, setActiveLocale] = useState(defaultLocale?.languageName || sortedLocales?.[0]?.languageName);
  const [focusedStates, setFocusedStates] = useState<Record<string, boolean>>({});
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileError, setFileError] = useState<FileValidationError | null>(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(0);
  const [selectedImage, setSelectedImage] = useState<{ index: number; locale: string } | null>(null);

  const visibleLocales = sortedLocales.slice(0, maxVisible);
  const dropdownLocales = sortedLocales.slice(maxVisible);

  const handleFocus = (locale: string) => setFocusedStates(prev => ({ ...prev, [locale]: true }));

  const handleBlur = (locale: string) => setFocusedStates(prev => ({ ...prev, [locale]: false }));

  const validateFile = (file: File): FileValidationError | null => {
    if (!file.type.startsWith('image/')) {
      return {
        message: 'Invalid file type. Only image files are allowed.',
        files: [file.name],
      };
    }

    if (file.size > maxSize) {
      return {
        message: `File size exceeds ${convertBytes(maxSize)}`,
        files: [file.name],
      };
    }

    return null;
  };

  const handleFileSelect = (field: ControllerRenderProps<T, Path<T>>, lang: string, files: File[], filenames: string[]) => {
    setFileError(null);

    for (const file of files) {
      const error = validateFile(file);

      if (error) {
        setFileError(error);

        return;
      }
    }

    if (files.length > maxFiles) {
      setFileError({
        message: `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`,
        files: filenames,
      });

      return;
    }

    onSelectFile(field, lang, files, filenames);
  };

  const handleRemoveActiveContent = (field: ControllerRenderProps<T, Path<T>>) => {
    if (selectedImage) {
      onRemoveFile(field, activeLocale);
      setActiveLocale(defaultLocale?.languageName || sortedLocales[0]?.languageName);
      setSelectedImage(null);
    }
    setIsConfirmOpen(false);
    setFileError(null);
  };

  const handleRemoveClick = (index: number, locale: string) => {
    setSelectedImage({ index, locale });
    setIsConfirmOpen(true);
  };

  const renderExistingImage = (field: ControllerRenderProps<T, Path<T>>, locale: string) => {
    const images = (field.value as TranslationValue[])?.filter(translation => translation.lang === locale);

    if (!images?.length) return null;

    return (
      <div className="existing-image absolute left-0 top-0 h-64 w-full rounded-lg border bg-background">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative h-full"
            onMouseEnter={() => setHoveredImageIndex(index)}
            onMouseLeave={() => setHoveredImageIndex(null)}
          >
            {imageUrl.value.startsWith('http') && (
              <>
                <img src={imageUrl.value} className="h-full w-full object-contain" />
                {hoveredImageIndex === index && (
                  <button
                    type="button"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2"
                    onClick={() => handleRemoveClick(index, locale)}
                  >
                    <Trash2Icon size={20} color="white" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPreview = (files: FilePreview[]) => {
    if (!files) return null;

    return (
      <div className="blob-image absolute left-0 top-0 h-64 w-full rounded-lg border bg-background">
        {files?.map((file, index) => (
          <div
            key={index}
            className="relative h-full"
            onMouseEnter={() => setHoveredImageIndex(index)}
            onMouseLeave={() => setHoveredImageIndex(null)}
          >
            {file.type.startsWith('image/') && file.url && (
              <>
                <img src={file.url} alt={file.name} className="h-full w-full object-contain" />
                {hoveredImageIndex === index && (
                  <button
                    type="button"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2"
                    onClick={() => handleRemoveClick(index, activeLocale)}
                  >
                    <Trash2Icon size={20} color="white" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {formLabel && (
            <FormLabel className={cn('text-xs font-medium', error ? 'text-destructive' : 'text-muted-foreground')}>
              {formLabel}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className={cn('space-y-4', className)}>
              <div className="flex h-10 items-center justify-between border-b border-input">
                <div className="flex h-full items-center">
                  {visibleLocales.map(locale => (
                    <button
                      key={locale.languageName}
                      type="button"
                      disabled={disabled}
                      className={cn(
                        'relative h-full whitespace-nowrap px-3 text-sm transition-colors focus:outline-none',
                        disabled && 'cursor-not-allowed opacity-50',
                        activeLocale === locale.languageName ? 'text-primary' : 'text-muted-foreground'
                      )}
                      onClick={() => setActiveLocale(locale.languageName)}
                    >
                      <span className="flex items-center gap-1">
                        {locale.languageLabel}
                        {locale.isDefault && <span className="ml-1">(Default)</span>}
                        <CheckIndicator values={field.value} lang={locale.languageName} />
                      </span>
                      {activeLocale === locale.languageName && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
                    </button>
                  ))}

                  {dropdownLocales.length > 0 && (
                    <Popover open={isOpenDropdown} onOpenChange={setIsOpenDropdown}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={disabled} className="h-10 px-2 hover:bg-secondary/30">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {dropdownLocales.map(locale => (
                                <CommandItem
                                  key={locale.languageName}
                                  className={activeLocale === locale.languageName ? '!bg-primary/20' : ''}
                                  disabled={disabled}
                                  onSelect={() => {
                                    setActiveLocale(locale.languageName);
                                    setIsOpenDropdown(false);
                                  }}
                                >
                                  <span className="flex w-full items-center justify-between gap-1">
                                    {locale.languageLabel}
                                    <CheckIndicator values={field.value} lang={locale.languageName} />
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              <div className="relative">
                {sortedLocales.map(locale => (
                  <div
                    key={locale.languageName}
                    className={cn(
                      'relative w-full rounded-md border-input bg-background ring-offset-background',
                      disabled && 'cursor-not-allowed',
                      focusedStates[locale.languageName] && 'ring-2 ring-ring ring-offset-2',
                      activeLocale !== locale.languageName && 'hidden'
                    )}
                  >
                    <FileUpload
                      className={cn('h-64 w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none')}
                      required={required}
                      disabled={disabled}
                      error={!!error}
                      isUploading={isUploading}
                      onSelectFile={(files, filenames) => handleFileSelect(field, locale.languageName, files, filenames)}
                      onFocus={() => handleFocus(locale.languageName)}
                      onBlur={() => handleBlur(locale.languageName)}
                    />
                    {renderExistingImage(field, locale.languageName)}
                    {renderPreview(previews[locale.languageName])}
                  </div>
                ))}
              </div>

              {fileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div>{fileError.message}</div>
                    <div className="text-xs">Affected files: {fileError.files.join(', ')}</div>
                  </AlertDescription>
                </Alert>
              )}
              <FileUploadRules className="mt-2" maxSize={maxSize} maxFiles={maxFiles} imageDimensions={imageDimensions} />
            </div>
          </FormControl>

          {error?.message && <FormMessage message={error.message} />}
          <ModalConfirm
            visible={isConfirmOpen}
            title="Are you sure?"
            content="This will permanently delete the file"
            btnYes="Yes"
            btnNo="No"
            onYes={() => handleRemoveActiveContent(field)}
            onNo={() => setIsConfirmOpen(false)}
          />
        </FormItem>
      )}
    />
  );
}

type FileUploadRulesProps = {
  className?: string;
  maxSize: number;
  maxFiles: number;
  imageDimensions?: ImageDimensions;
};

function FileUploadRules({ className, maxSize, maxFiles, imageDimensions }: FileUploadRulesProps) {
  return (
    <ul className={cn('list-inside list-disc space-y-1 text-xs text-muted-foreground', className)}>
      <li>Images should not be blurred</li>
      {imageDimensions && (
        <li>
          Images dimensions {imageDimensions.width}x{imageDimensions.height}
        </li>
      )}
      <li>
        Maximum of {maxFiles} file{maxFiles > 1 ? 's' : ''} can be uploaded
      </li>
      <li>File size should not exceed {convertBytes(maxSize)}</li>
      <li>Supports JPEG, PNG, JPG, HEIC (image files)</li>
    </ul>
  );
}
