import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useLocale, useTranslations } from 'use-intl';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Calendar } from '~react-web-ui-shadcn/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { toDateTime } from '@/utils/date.util';

const currentYear = new Date().getFullYear();

type FormFieldDatePickerProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
} & ComponentBaseProps;

export default function FormFieldDatePicker<T extends FieldValues>({ form, formLabel, fieldName }: FormFieldDatePickerProps<T>) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem>
            <FormLabel>{formLabel ?? t('form_field_date_picker')}</FormLabel>
            <FormControl>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className="w-full justify-start px-3">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? toDateTime(field.value, locale, false) : ''}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {field.value && (
                    <Calendar
                      initialFocus
                      mode="single"
                      captionLayout="dropdown-buttons"
                      fromYear={currentYear}
                      toYear={currentYear + 100}
                      defaultMonth={field.value}
                      selected={field.value}
                      onSelect={value => {
                        field.onChange(value);
                        setIsOpen(false);
                      }}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </FormControl>
            {error?.message && <FormMessage message={t(error.message)} />}
          </FormItem>
        );
      }}
    />
  );
}
