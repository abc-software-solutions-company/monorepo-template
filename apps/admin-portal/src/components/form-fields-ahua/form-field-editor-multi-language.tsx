import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { InputEditor } from '~react-web-ui-shadcn/components/ahua/input-editor';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '~react-web-ui-shadcn/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';

import { Locale, TranslationValue } from '@/interfaces/language.interface';

import { CheckIndicator } from './form-field-base';

const container = cva('w-full rounded-md border border-input bg-background ring-offset-background', {
  variants: {
    state: {
      default: '',
      focused: 'ring-2 ring-ring ring-offset-2',
      disabled: 'cursor-not-allowed bg-muted',
      error: 'border-destructive bg-destructive/10',
      errorFocused: 'bg-destructive/10 ring-2 ring-destructive ring-offset-2',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

const input = cva('w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none', {
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

interface IFormFieldEditorMultiLanguageProps<T extends FieldValues> extends VariantProps<typeof container> {
  dataTestId?: string;
  className?: string;
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  locales: Locale[];
  placeholder?: string;
  disabled?: boolean;
  visibled?: boolean;
  required?: boolean;
  showErrorMessage?: boolean;
  maxVisible?: number;
  minLength?: number;
  maxLength?: number;
}

export default function FormFieldEditorMultiLanguage<T extends FieldValues>({
  dataTestId,
  className,
  messageClassName,
  form,
  formLabel,
  fieldName,
  locales,
  placeholder = 'Type something...',
  visibled = true,
  disabled,
  required,
  showErrorMessage = true,
  maxVisible = 4,
  maxLength = 255,
}: IFormFieldEditorMultiLanguageProps<T>) {
  const sortedLocales = [...locales].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : a.languageLabel.localeCompare(b.languageLabel)));
  const defaultLocale = sortedLocales.find(locale => locale.isDefault);

  const [activeLocale, setActiveLocale] = useState(defaultLocale?.languageName || sortedLocales?.[0]?.languageName);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const visibleLocales = sortedLocales.slice(0, maxVisible);
  const dropdownLocales = sortedLocales.slice(maxVisible);

  const getCharCount = (values: TranslationValue[] = [], lang: string): number => {
    const value = values.find(item => item.lang === lang)?.value || '';

    const valueOnlyText = value.replace(/<\/?[^>]+(>|$)/g, '');

    return valueOnlyText?.length || 0;
  };

  const isOverMaxLength = (values: TranslationValue[] = [], lang: string): boolean => getCharCount(values, lang) > maxLength;

  const getFormControlState = (error?: boolean) => {
    if (disabled) return 'disabled';
    if (error) return isFocused ? 'errorFocused' : 'error';
    if (isFocused) return 'focused';

    return 'default';
  };

  const getInputState = (error?: boolean) => {
    if (disabled) return 'disabled';
    if (error) return 'error';

    return 'default';
  };

  const getTabState = (isActive: boolean, hasError: boolean) => {
    if (disabled) return 'disabled';
    if (hasError) return 'error';
    if (isActive) return 'active';

    return 'default';
  };

  const handleInputChange = (
    field: {
      value?: TranslationValue[];
      onChange: (value: TranslationValue[]) => void;
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
            <div data-testid={dataTestId} className={cn(container({ state: getFormControlState(!!error) }), className)}>
              <div className="flex h-10 items-center border-b border-input">
                {visibleLocales.map(locale => {
                  const isTooLong = isOverMaxLength(field.value, locale.languageName);
                  const isActive = activeLocale === locale.languageName;

                  return (
                    <Button
                      key={locale.languageName}
                      variant="transparent"
                      type="button"
                      disabled={disabled}
                      className={tab({
                        state: getTabState(isActive, isTooLong),
                      })}
                      onClick={() => setActiveLocale(locale.languageName)}
                    >
                      <span className="flex items-center gap-1">
                        {locale.languageLabel}
                        {locale.isDefault && <span className="ml-1">(Default)</span>}
                        <CheckIndicator values={field.value} lang={locale.languageName} error={isTooLong} />
                      </span>
                      {isActive && <div className={cn('absolute bottom-0 left-0 h-0.5 w-full', isTooLong ? 'bg-destructive' : 'bg-primary')} />}
                    </Button>
                  );
                })}

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
                            {dropdownLocales.map((locale, index) => {
                              const isTooLong = isOverMaxLength(field.value, locale.languageName);
                              const isActive = activeLocale === locale.languageName;

                              return (
                                <CommandItem
                                  key={locale.languageName}
                                  tabIndex={index}
                                  className={isActive ? '!bg-primary/20' : ''}
                                  disabled={disabled}
                                  onSelect={() => {
                                    setActiveLocale(locale.languageName);
                                    setIsOpenDropdown(false);
                                  }}
                                >
                                  <span className={cn('flex w-full items-center justify-between gap-1', isTooLong && 'text-destructive')}>
                                    {locale.languageLabel}
                                    <CheckIndicator values={field.value} lang={locale.languageName} />
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
              <InputEditor
                className={input({ state: getInputState(isOverMaxLength(field.value, activeLocale)) })}
                placeholder={placeholder}
                value={field.value?.find((item: TranslationValue) => item.lang === activeLocale)?.value || ''}
                required={required}
                disabled={disabled}
                onChange={value => handleInputChange(field, activeLocale, value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
          </FormControl>

          {!error?.message && (
            <p className={cn(isOverMaxLength(field.value, activeLocale) && 'text-destructive')}>
              {getCharCount(field.value, activeLocale)}/{maxLength}
            </p>
          )}
          {showErrorMessage && <FormMessage className={messageClassName} />}
        </FormItem>
      )}
    />
  );
}
