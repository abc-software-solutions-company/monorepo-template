/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-07 15:16:56
 */

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronRightIcon, ChevronsUpDown } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/react-web-ui-shadcn/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@repo/react-web-ui-shadcn/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/react-web-ui-shadcn/components/ui/popover';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import { Region, ShopStore } from '../interfaces/shop-stores.interface';

type ShopStoreListProps = {
  className?: string;
  showCounter?: boolean;
  stores: ShopStore[];
  selectedStore?: ShopStore;
  onStoreClick: (store: ShopStore) => void;
};

const ShopStoreList: React.FC<ShopStoreListProps> = ({ className, showCounter = false, stores = [], selectedStore, onStoreClick }) => {
  const t = useTranslations();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openRegions, setOpenRegions] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const regions: Region[] =
    stores?.length > 0
      ? Array.from(new Set(stores.map(store => store.region))).map(region => ({
          name: region,
          count: stores.filter(store => store.region === region).length,
          stores: stores.filter(store => store.region === region),
        }))
      : [];

  if (!stores?.length) {
    return (
      <div className={cn('flex h-full flex-col rounded-lg border border-primary bg-muted', className)}>
        <div className="p-4 text-center">{t('no_stores_available', { defaultMessage: 'Không có cửa hàng' })}</div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className={cn('absolute left-0 top-0 z-10 w-full lg:hidden', className)}>
        <div className="py-1.5 pl-16 pr-1.5">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-full justify-between text-left font-normal">
                <p className="overflow-hidden text-ellipsis">{selectedStore ? selectedStore.name : t('select_store')}</p>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 lg:hidden" side="bottom" align="end">
              <Command>
                <CommandInput placeholder={t('search_store')} />
                <CommandList className="scrollbar p-0">
                  <CommandEmpty>{t('no_store_found')}</CommandEmpty>
                  {regions.map(region => (
                    <CommandGroup key={region.name} heading={region.name} className="p-0">
                      {region.stores.map(store => (
                        <CommandItem
                          key={store.id}
                          value={store.name}
                          onSelect={() => {
                            onStoreClick(store);
                            setIsOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', selectedStore?.id === store.id ? 'opacity-100' : 'opacity-0')} />
                          <div>
                            <p>{store.name}</p>
                            <p className="text-sm text-muted-foreground">ĐT: {store.phoneNumber}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Desktop View */}
      <div className={cn('relative z-10 hidden h-full flex-col rounded-lg border border-primary bg-muted lg:flex', className)}>
        <div className="border-b border-foreground/50 p-4">
          <h2 className="font-bold uppercase">{t('list_of_stores')}</h2>
        </div>
        <div className="scrollbar flex-1 p-4 pt-0">
          {regions.map((region, index) => (
            <Collapsible
              key={region.name}
              open={openRegions.includes(region.name)}
              onOpenChange={() => {
                setOpenRegions(prev => (prev.includes(region.name) ? prev.filter(r => r !== region.name) : [...prev, region.name]));
              }}
            >
              <CollapsibleTrigger
                className={cn(
                  'flex w-full items-center justify-between border-t border-foreground/20 py-4 hover:text-primary',
                  index === 0 && 'border-t-0'
                )}
              >
                <div className="flex items-center gap-2 text-left">
                  <span className="font-semibold uppercase">{region.name}</span>
                  {showCounter && <span className="text-sm text-foreground/80">({region.count})</span>}
                </div>
                <ChevronRightIcon className={cn('h-5 w-5 transition-transform', openRegions.includes(region.name) && 'rotate-90')} />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down">
                {region.stores.map(store => (
                  <div
                    key={store.id}
                    className={cn(
                      'cursor-pointer border-t border-foreground/20 px-4 py-3',
                      'hover:text-primary',
                      selectedStore?.id === store.id && 'font-bold'
                    )}
                    onClick={() => onStoreClick(store)}
                  >
                    <p className="text-sm">{store.name}</p>
                    <p className="mt-1 text-sm">ĐT: {store.phoneNumber}</p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopStoreList;
