/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-13 17:27:23
 */

import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { CheckIndicator } from '@repo/react-web-ui-shadcn/components/form-fields-base/check-indicator';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Command, CommandGroup, CommandItem, CommandList } from '@repo/react-web-ui-shadcn/components/ui/command';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/react-web-ui-shadcn/components/ui/popover';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { Language, Translation } from '@repo/shared-universal/interfaces/language.interface';

import { IMAGE_THUMBNAIL_URL } from '@/constants/file.constant';

import ButtonRemoveFile from '@/components/button-remove-file';
import ButtonSelectFile from '@/components/button-select-file';

import FileDialog from '@/modules/files/components/file-dialog';

interface IFormFieldCardCoverMultiLanguageProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  locales: Language[];
  maxLength?: number;
  maxVisible?: number;
  required?: boolean;
}

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

export default function FormFieldCardCoverMultiLanguage<T extends FieldValues>({
  form,
  formLabel,
  fieldName,
  locales,
  maxLength = 1000,
  maxVisible = 4,
  required,
}: IFormFieldCardCoverMultiLanguageProps<T>) {
  const t = useTranslations();
  const [isFileManagerVisible, setIsFileManagerVisible] = useState(false);
  const sortedLocales = [...locales].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.name.localeCompare(b.name)));
  const defaultLocale = sortedLocales.find(locale => locale.isDefault);
  const [activeLocale, setActiveLocale] = useState(defaultLocale?.code || sortedLocales?.[0]?.code);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const visibleLocales = sortedLocales.slice(0, maxVisible);
  const dropdownLocales = sortedLocales.slice(maxVisible);

  const handleImageSelect = (
    field: {
      value?: Translation[];
      onChange: (value: Translation[]) => void;
    },
    lang: string,
    value: string
  ) => {
    const values = [...(field.value || [])];
    const index = values.findIndex(v => v.lang === lang);

    if (index >= 0) {
      values[index] = { ...values[index], value };
    } else {
      values.push({ lang, value });
    }

    field.onChange(values);
  };

  const getTabState = (isActive: boolean) => {
    if (isActive) return 'active';

    return 'default';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {formLabel ?? t('form_field_image')}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {locales.length > 1 && (
          <div className="mb-2 flex items-center border-b border-input">
            {visibleLocales.map(locale => {
              const isActive = activeLocale === locale.code;

              return (
                <Button
                  key={locale.code}
                  variant="transparent"
                  type="button"
                  className={cn(tab({ state: getTabState(isActive) }), 'h-10')}
                  onClick={() => setActiveLocale(locale.code)}
                >
                  <span className="flex items-center gap-1">
                    {locale.name}
                    {locale.isDefault && <span className="text-sm">(Default)</span>}
                    <CheckIndicator values={form.getValues(fieldName)} lang={locale.code} />
                  </span>
                  {isActive && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
                </Button>
              );
            })}
            {dropdownLocales.length > 0 && (
              <Popover open={isOpenDropdown} onOpenChange={setIsOpenDropdown}>
                <PopoverTrigger asChild>
                  <Button variant="transparent" size="sm" className="h-10 px-2 hover:bg-secondary/30">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" side="right" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {dropdownLocales.map((locale, index) => {
                          const isActive = activeLocale === locale.code;

                          return (
                            <CommandItem
                              key={locale.code}
                              tabIndex={index}
                              className={isActive ? '!bg-primary/20' : ''}
                              onSelect={() => {
                                setActiveLocale(locale.code);
                                setIsOpenDropdown(false);
                              }}
                            >
                              <span className="flex w-full items-center justify-between gap-1">
                                {locale.name}
                                <CheckIndicator values={form.getValues(fieldName)} lang={locale.code} />
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name={fieldName}
          render={({ field, fieldState: { error } }) => (
            <>
              <FormItem>
                <FormControl>
                  <Input readOnly {...field} className="hidden" />
                </FormControl>
                {field.value?.find((item: Translation) => item.lang === activeLocale)?.value && (
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      className="aspect-video w-full object-cover"
                      src={IMAGE_THUMBNAIL_URL + field.value?.find((item: Translation) => item.lang === activeLocale)?.value}
                      alt={field.value?.find((item: Translation) => item.lang === activeLocale)?.value}
                      height="100"
                      width="100"
                    />
                    <ButtonRemoveFile
                      onClick={() => {
                        const newValues = field.value?.filter((item: Translation) => item.lang !== activeLocale) || [];

                        form.setValue(fieldName, newValues as PathValue<T, Path<T>>);
                      }}
                    />
                  </div>
                )}
                {error?.message && <FormMessage message={t(error.message, { max: maxLength })} />}
              </FormItem>
              {!field.value?.find((item: Translation) => item.lang === activeLocale)?.value && (
                <ButtonSelectFile className="w-full py-12" onClick={() => setIsFileManagerVisible(true)} />
              )}
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
              form.getValues(fieldName);
              handleImageSelect(
                {
                  value: form.getValues(fieldName),
                  onChange: value => form.setValue(fieldName, value as PathValue<T, Path<T>>),
                },
                activeLocale,
                files[0].uniqueName
              );
              setIsFileManagerVisible(false);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
