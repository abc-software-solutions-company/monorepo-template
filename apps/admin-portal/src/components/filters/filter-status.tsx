import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { CheckIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@repo/react-web-ui-shadcn/components/ui/command';

import { OptionType } from '@/interfaces/status.interface';

interface IFilterStatusProps {
  title?: string;
  value: string[];
  options: OptionType[];
  onChange?: (values: string[]) => void;
  onClose?: () => void;
}

const FilterStatus = ({ title, value = [], options, onChange, onClose }: IFilterStatusProps) => {
  const t = useTranslations();
  const [selectedItems, setSelectedItems] = useState(value);

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    onChange?.(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  return (
    <Command>
      <CommandInput placeholder={title} />
      <CommandList className="scrollbar">
        <CommandEmpty>{t('no_results_found')}</CommandEmpty>
        <CommandGroup>
          {options.map(option => (
            <CommandItem key={option.value} onSelect={() => toggleItem(option.value)}>
              <div
                className={classNames(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedItems.includes(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                )}
              >
                <CheckIcon className={classNames('h-4 w-4')} />
              </div>
              {option.icon && <option.icon className={classNames('mr-2 h-4 w-4', option.iconClassName)} />}
              <span>{option.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {selectedItems.length > 0 && (
          <>
            <CommandSeparator className="mx-0" />
            <CommandGroup>
              <CommandItem className="justify-center text-center" onSelect={() => setSelectedItems([])}>
                {t('filter_clear')}
              </CommandItem>
            </CommandGroup>
          </>
        )}
        <CommandGroup>
          <Button className="w-full" onClick={onClose}>
            {t('close')}
          </Button>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default FilterStatus;
