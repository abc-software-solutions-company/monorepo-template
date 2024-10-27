import { FC, Fragment, useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, ChevronDown, CircleCheckBigIcon, Trash2Icon } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '~react-web-ui-shadcn/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel } from '~react-web-ui-shadcn/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { convertBytes } from '~shared-universal/utils/string.util';

import FileUpload from './file-upload';

import { Locale, LocaleValue } from '../../modules/multi-step-form/constants/campaign.constant';
import ModalConfirm from '../modals/modal-confirm';

const container = cva('w-full rounded-md  border-input bg-background ring-offset-background', {
  variants: {
    state: {
      default: '',
      focused: 'ring-2 ring-ring ring-offset-2',
      disabled: 'cursor-not-allowed bg-muted',
      error: 'border-destructive bg-destructive/10',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

const input = cva('h-64 w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none', {
  variants: {
    state: {
      default: '',
      disabled: 'opacity-50 cursor-not-allowed',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

const tab = cva('relative h-full whitespace-nowrap px-3 text-sm transition-colors focus:outline-none', {
  variants: {
    state: {
      default: 'text-muted-foreground',
      active: 'text-primary',
      error: 'text-destructive',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

const label = cva('text-xs font-medium', {
  variants: {
    state: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

type FilePreview = {
  name: string;
  size: number;
  type: string;
  url?: string;
};

type ImageDimensions = {
  width: number;
  height: number;
};

interface IProps<T extends FieldValues> extends VariantProps<typeof container> {
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
}

type FileUploadRulesProps = {
  className?: string;
  maxSize: number;
  maxFiles: number;
  imageDimensions?: ImageDimensions;
};

type FormFieldProps = {
  value?: LocaleValue[];
  onChange: (value: LocaleValue[]) => void;
};

const FileUploadRules: React.FC<FileUploadRulesProps> = ({ className, maxSize, maxFiles, imageDimensions }) => (
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
  maxSize = 52428800,
  imageDimensions,
  maxFiles = 1,
}: IProps<T>) {
  const sortedLocales = [...locales].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.languageLabel.localeCompare(b.languageLabel)));
  const defaultLocale = sortedLocales.find(locale => locale.isDefault);

  const [activeLocale, setActiveLocale] = useState(defaultLocale?.languageName || sortedLocales?.[0]?.languageName);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [previews, setPreviews] = useState<Record<string, FilePreview[]>>({});

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(files => {
        files.forEach(file => {
          if (file.url) URL.revokeObjectURL(file.url);
        });
      });
    };
  }, [previews]);

  const visibleLocales = sortedLocales.slice(0, maxVisible);
  const dropdownLocales = sortedLocales.slice(maxVisible);

  const hasInput = (values: LocaleValue[] = [], lang: string): boolean => {
    const value = values.find(item => item.lang === lang)?.value;

    return Boolean(value?.trim());
  };

  const getContainerState = (error?: boolean): 'disabled' | 'error' | 'focused' | 'default' => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'focused';

    return 'default';
  };

  const getInputState = (error?: boolean): 'disabled' | 'error' | 'default' => {
    if (disabled) return 'disabled';
    if (error) return 'error';

    return 'default';
  };

  const getTabState = (isActive: boolean): 'disabled' | 'active' | 'default' => {
    if (disabled) return 'disabled';
    if (isActive) return 'active';

    return 'default';
  };

  const handleFileSelect = (field: FormFieldProps, lang: string, files: File[], filenames: string[]) => {
    const values = [...(field.value || [])];
    const index = values.findIndex(v => v.lang === lang);

    const fileInfos: FilePreview[] = filenames.map((filename, idx) => ({
      name: filename,
      size: files[idx].size,
      type: files[idx].type,
      url: URL.createObjectURL(files[idx]),
    }));

    setPreviews(prev => ({
      ...prev,
      [lang]: fileInfos,
    }));

    const value = JSON.stringify(fileInfos.map(({ ...rest }) => rest));

    if (index >= 0) {
      values[index] = { ...values[index], value };
    } else {
      values.push({ lang, value });
    }

    field.onChange(values);
  };

  const handleRemoveFile = (field: FormFieldProps, lang: string, fileIndex: number) => {
    setPreviews(prev => {
      const langPreviews = prev[lang];

      if (!langPreviews) return prev;

      if (langPreviews[fileIndex]?.url) {
        URL.revokeObjectURL(langPreviews[fileIndex].url);
      }

      const newPreviews = {
        ...prev,
        [lang]: langPreviews.filter((_, idx) => idx !== fileIndex),
      };

      if (newPreviews[lang].length === 0) {
        delete newPreviews[lang];
      }

      return newPreviews;
    });

    const values = [...(field.value || [])];
    const valueIndex = values.findIndex(v => v.lang === lang);

    if (valueIndex >= 0) {
      const currentFiles = JSON.parse(values[valueIndex].value) as FilePreview[];
      const newFiles = currentFiles.filter((_, idx) => idx !== fileIndex);

      if (newFiles.length === 0) {
        values.splice(valueIndex, 1);
      } else {
        values[valueIndex] = { ...values[valueIndex], value: JSON.stringify(newFiles) };
      }

      field.onChange(values);
    }
  };

  const CheckIndicator: FC<{ values: LocaleValue[]; lang: string }> = ({ values, lang }) => {
    if (!hasInput(values, lang)) return null;

    return <CircleCheckBigIcon size={12} className={cn('text-primary')} />;
  };

  const renderPreview = (field: FormFieldProps, files: FilePreview[]): JSX.Element => (
    <div className="relative h-64" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {files.map((file, index) => (
        <Fragment key={index}>
          <div className="flex h-full items-center justify-center">
            {file.type.startsWith('image/') && file.url && <img src={file.url} alt={file.name} className="h-full w-full rounded-md object-contain" />}
          </div>
          {isHovered && (
            <button
              type="button"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3"
              onClick={() => setIsConfirmVisible(true)}
            >
              <Trash2Icon size={24} color="white" />
            </button>
          )}
          <ModalConfirm
            visible={isConfirmVisible}
            title="Are you sure?"
            content="This will permanently delete the file"
            btnYes="Yes"
            btnNo="No"
            onYes={() => handleRemoveFile(field, activeLocale, index)}
            onNo={() => setIsConfirmVisible(false)}
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
            <FormLabel className={label({ state: error ? 'error' : 'default' })}>
              {formLabel}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className={cn(container({ state: getContainerState(!!error) }), className)}>
              <div className="flex h-10 items-center border-b border-input">
                {visibleLocales.map(locale => (
                  <button
                    key={locale.id}
                    type="button"
                    disabled={disabled}
                    className={tab({
                      state: getTabState(activeLocale === locale.languageName),
                    })}
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
                                key={locale.id}
                                disabled={disabled}
                                onSelect={() => {
                                  setActiveLocale(locale.languageName);
                                  setIsOpenDropdown(false);
                                }}
                              >
                                <span className="flex w-full items-center justify-between gap-1">
                                  {locale.languageLabel}
                                  <CheckIndicator values={field.value} lang={locale.languageName} />
                                  {activeLocale === locale.languageName && <CheckIcon className="h-4 w-4 text-primary" />}
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

              <div className="mt-4">
                {previews[activeLocale] && renderPreview(field, previews[activeLocale])}
                {!previews[activeLocale] && (
                  <FileUpload
                    className={cn(input({ state: getInputState(!!error) }))}
                    required={required}
                    onFileSelect={(files, filenames) => handleFileSelect(field, activeLocale, files, filenames)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                )}

                <FileUploadRules className="mt-2" maxSize={maxSize} maxFiles={maxFiles} imageDimensions={imageDimensions} />
              </div>
            </div>
          </FormControl>
          {error?.message && <p className="mt-1.5 text-xs text-destructive">{error.message}</p>}
        </FormItem>
      )}
    />
  );
}
