import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@repo/react-web-ui-shadcn/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/react-web-ui-shadcn/components/ui/popover';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { useAppData } from '@/modules/app-data/hooks/use-app-data';

type FormFieldSelectCountryProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
} & ComponentBaseProps;

export default function FormFieldSelectCountry<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'country' as Path<T>,
}: FormFieldSelectCountryProps<T>) {
  const t = useTranslations();
  const { countries } = useAppData();
  const [isOpen, setIsOpen] = useState(false);

  const selectCountryByCode = (value: string) => countries.find(x => x.code === value);
  const selectCountryByName = (value: string) => countries.find(x => x.name === value);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_country')}</FormLabel>
          <FormControl>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-full justify-between px-3">
                  {field.value ? (
                    <div className="flex items-center gap-2">
                      <span className="mt-1">{selectCountryByCode(field.value)?.flag}</span>
                      <span>{selectCountryByCode(field.value)?.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{t('select_country')}</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <Command>
                  <CommandInput placeholder="Search item..." />
                  <CommandList className="scrollbar">
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map(item => (
                        <CommandItem
                          key={item.code}
                          value={item.name}
                          itemRef=""
                          className="flex items-center gap-2"
                          onSelect={currentValue => {
                            field.onChange(selectCountryByName(currentValue)?.code);
                            setIsOpen(false);
                          }}
                        >
                          <span className="mt-1">{item.flag}</span>
                          <span>{item.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: 1 })} />}
        </FormItem>
      )}
    />
  );
}
