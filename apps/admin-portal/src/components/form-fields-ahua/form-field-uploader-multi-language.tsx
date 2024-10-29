import { Fragment, useState } from 'react';
import { ChevronDown, Trash2Icon } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import FileUpload from '~react-web-ui-shadcn/components/ahua/file-upload';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '~react-web-ui-shadcn/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { convertBytes } from '~shared-universal/utils/string.util';

import { FormFieldTranslationProps } from '@/modules/multi-step-form/interfaces/campaign.interface';

import { CheckIndicator } from './form-field-base';

import { Locale } from '../../modules/multi-step-form/constants/campaign.constant';
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
  onSelectFile: (field: FormFieldTranslationProps, lang: string, files: File[], filenames: string[]) => void;
  onRemoveFile: (field: FormFieldTranslationProps, lang: string, fileIndex: number) => void;
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
  onSelectFile,
  onRemoveFile,
}: IFormFieldUploaderMultiLanguageProps<T>) {
  const sortedLocales = [...locales].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.languageLabel.localeCompare(b.languageLabel)));
  const defaultLocale = sortedLocales.find(locale => locale.isDefault);

  const [activeLocale, setActiveLocale] = useState(defaultLocale?.languageName || sortedLocales?.[0]?.languageName);
  const [focusedStates, setFocusedStates] = useState<Record<string, boolean>>({});
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [hoveredStates, setHoveredStates] = useState<Record<string, boolean>>({});
  const [confirmStates, setConfirmStates] = useState<Record<string, boolean>>({});

  const visibleLocales = sortedLocales.slice(0, maxVisible);
  const dropdownLocales = sortedLocales.slice(maxVisible);

  const handleFocus = (locale: string) => setFocusedStates(prev => ({ ...prev, [locale]: true }));
  const handleBlur = (locale: string) => setFocusedStates(prev => ({ ...prev, [locale]: false }));
  const handleMouseEnter = (locale: string) => setHoveredStates(prev => ({ ...prev, [locale]: true }));
  const handleMouseLeave = (locale: string) => setHoveredStates(prev => ({ ...prev, [locale]: false }));

  const renderPreview = (field: FormFieldTranslationProps, locale: string, files: FilePreview[]): JSX.Element => (
    <div className="relative h-64" onMouseEnter={() => handleMouseEnter(locale)} onMouseLeave={() => handleMouseLeave(locale)}>
      {files.map((file, index) => (
        <Fragment key={index}>
          <div className="flex h-full items-center justify-center rounded-md bg-black/5">
            {file.type.startsWith('image/') && file.url && <img src={file.url} alt={file.name} className="h-full w-full rounded-md object-contain" />}
          </div>
          {hoveredStates[locale] && (
            <button
              type="button"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3"
              onClick={() => setConfirmStates(prev => ({ ...prev, [locale]: true }))}
            >
              <Trash2Icon size={24} color="white" />
            </button>
          )}
          <ModalConfirm
            visible={confirmStates[locale]}
            title="Are you sure?"
            content="This will permanently delete the file"
            btnYes="Yes"
            btnNo="No"
            onYes={() => {
              onRemoveFile(field, locale, index);
              setConfirmStates(prev => ({ ...prev, [locale]: false }));
            }}
            onNo={() => setConfirmStates(prev => ({ ...prev, [locale]: false }))}
          />
        </Fragment>
      ))}
    </div>
  );

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
              <div className="flex h-10 items-center border-b border-input">
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

              {sortedLocales.map(locale => (
                <div
                  key={locale.languageName}
                  className={cn(
                    'w-full rounded-md border-input bg-background ring-offset-background',
                    disabled && 'cursor-not-allowed',
                    focusedStates[locale.languageName] && 'ring-2 ring-ring ring-offset-2',
                    activeLocale !== locale.languageName && 'hidden'
                  )}
                >
                  {previews[locale.languageName] ? (
                    renderPreview(field, locale.languageName, previews[locale.languageName])
                  ) : (
                    <FileUpload
                      className={cn('h-64 w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none')}
                      required={required}
                      disabled={disabled}
                      error={!!error}
                      onSelectFile={(files, filenames) => onSelectFile(field, locale.languageName, files, filenames)}
                      onFocus={() => handleFocus(locale.languageName)}
                      onBlur={() => handleBlur(locale.languageName)}
                    />
                  )}
                  <FileUploadRules className="mt-2" maxSize={maxSize} maxFiles={maxFiles} imageDimensions={imageDimensions} />
                </div>
              ))}
            </div>
          </FormControl>
          {error?.message && <FormMessage message={error.message} />}
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
