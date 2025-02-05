import React, { useMemo, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { format, isValid, Locale } from 'date-fns';
import { Matcher } from 'react-day-picker';
import { HelperText } from '../form-fields-base/helper-text';

export const CURRENT_YEAR = new Date().getFullYear();

type FormFieldInputDatePickerProps<T extends FieldValues> = {
  messageClassName?: string;
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName: Path<T>;
  disabled?: boolean;
  visibled?: boolean;
  required?: boolean;
  helperText?: string;
  showErrorMessage?: boolean;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  disableBefore?: Date;
  dateFormat?: string;
  locale?: Locale;
  translator?: any;
  onChange?: (date: Date | undefined) => void;
};

export default function FormFieldInputDatePicker<T extends FieldValues>({
  messageClassName,
  form,
  formLabel,
  fieldName,
  disabled = false,
  visibled = true,
  required = false,
  helperText,
  showErrorMessage = true,
  placeholder = 'Pick a date',
  fromYear = CURRENT_YEAR,
  toYear = CURRENT_YEAR + 10,
  disableBefore,
  dateFormat = 'dd/MM/yyyy',
  locale,
  translator,
  onChange,
}: FormFieldInputDatePickerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (disabled) return;
    onChange?.(date);
    setIsOpen(false);
  };

  if (!visibled) return null;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => {
        const formattedDate = () => {
          if (!field.value || !isValid(field.value)) return '';
          try {
            return format(field.value, dateFormat);
          } catch (e) {
            return '';
          }
        };

        return (
          <FormItem>
            <FormLabel>{formLabel}</FormLabel>
            <FormControl>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className="w-full justify-start px-3">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formattedDate ? (
                      <span className="text-foreground">{formattedDate()}</span>
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {field.value && (
                    <Calendar
                      locale={locale}
                      initialFocus
                      mode="single"
                      captionLayout="dropdown-buttons"
                      fromYear={fromYear}
                      toYear={toYear}
                      defaultMonth={field.value}
                      selected={field.value}
                      disabled={{ before: disableBefore } as Matcher}
                      onSelect={handleSelect}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </FormControl>
            {!error && (
              <>
                <HelperText text={helperText} />
              </>
            )}
            {showErrorMessage && error?.message && <FormMessage className={messageClassName} message={translator?.(error.message)} />}
          </FormItem>
        );
      }}
    />
  );
}
