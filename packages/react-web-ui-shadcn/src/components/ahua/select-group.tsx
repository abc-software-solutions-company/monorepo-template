import React, { FC, ForwardedRef, forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cva, type VariantProps } from 'class-variance-authority';
import { Separator } from '../ui/separator';
import { InputLabel } from './input-base';
import { Button } from '../ui/button';

const formControlVariants = cva('relative rounded-md border border-input bg-background ring-offset-background', {
  variants: {
    size: {
      default: 'h-14',
      sm: 'h-10',
    },
    state: {
      default: '',
      focused: 'ring-2 ring-ring ring-offset-2 ring-offset-background',
      disabled: 'cursor-not-allowed bg-muted',
      error: 'border-destructive bg-destructive/10',
      errorFocused: 'bg-destructive/10 ring-2 ring-destructive ring-offset-2',
    },
  },
  defaultVariants: {
    size: 'default',
    state: 'default',
  },
});

const contentVariants = cva('px-3 text-sm overflow-hidden truncate text-ellipsis whitespace-nowrap font-medium', {
  variants: {
    size: {
      default: '!leading-[24px] h-[28px]',
      sm: '!leading-[22px] h-[22px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const triggerVariants = cva('grid w-full justify-between focus:outline-none text-left', {
  variants: {
    size: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const triggerIconVariants = cva('absolute -translate-y-1/2', {
  variants: {
    size: {
      default: 'top-1/2 h-4 w-4 right-2',
      sm: 'top-1/2 h-3 w-3 right-2',
    },
    state: {
      default: '',
      disabled: 'opacity-50',
    },
  },
  defaultVariants: {
    size: 'default',
    state: 'default',
  },
});

const commandInputVariants = cva('', {
  variants: {
    size: {
      default: '',
      sm: 'h-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const commandItemVariants = cva('flex items-center pl-6 justify-between rounded-none', {
  variants: {
    size: {
      default: 'h-9',
      sm: 'h-8 text-xs',
    },
    selected: {
      true: 'bg-primary/10',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    selected: false,
  },
});

const groupHeaderVariants = cva('flex items-center justify-between px-2 py-2 text-sm font-semibold', {
  variants: {
    size: {
      default: 'h-9',
      sm: 'h-8 text-xs',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const checkboxVariants = cva('flex items-center justify-center rounded-sm border border-primary', {
  variants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-3 w-3',
    },
    selected: {
      all: 'bg-primary text-primary-foreground',
      partial: 'bg-primary/50 !border-primary/30',
      none: 'opacity-50',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const tagVariants = cva('whitespace-nowrap py-1 px-1.5 flex items-center rounded-full border border-primary font-medium bg-primary/10 text-primary', {
  variants: {
    size: {
      default: 'text-xs',
      sm: 'text-[10px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const tagIconVariants = cva('ml-1 cursor-pointer', {
  variants: {
    size: {
      default: 'size-3',
      sm: 'size-2.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type BaseOption = Record<string, string>;

export interface GroupOption<T extends BaseOption> {
  id: string;
  name: string;
  children: T[];
}

interface SelectGroupProps<T extends BaseOption> extends VariantProps<typeof formControlVariants> {
  className?: string;
  value: T[];
  options: GroupOption<T>[];
  placeholder?: string;
  label?: string;
  labelClassName?: string;
  tagListClassName?: string;
  required?: boolean;
  disabled?: boolean;
  valueField?: keyof T;
  displayField?: keyof T;
  size?: 'default' | 'sm';
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectAll?: boolean;
  showSelectedTags?: boolean;
  showGroupNameWhenEmpty?: boolean;
  error?: boolean;
  onChange: (value: T[]) => void;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}

export const SelectGroup = forwardRef(
  <T extends BaseOption>(
    {
      className,
      value = [],
      options,
      placeholder = 'Select items...',
      label,
      labelClassName,
      tagListClassName,
      required = false,
      disabled = false,
      valueField = 'id' as keyof T,
      displayField = 'name' as keyof T,
      size = 'default',
      error = false,
      showSearch = true,
      showClearAll = true,
      showSelectedTags = true,
      showGroupNameWhenEmpty = false,
      onChange,
      onBlur,
    }: SelectGroupProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedIds = useMemo(() => new Set(value.map(v => v[valueField])), [value, valueField]);

    const groupedTags = useMemo(() => {
      return options.map(group => {
        const selected = value.filter(v => group.children.some(child => child[valueField] === v[valueField]));
        return {
          group,
          selected,
          showAllTag: selected.length === 0,
        };
      });
    }, [options, value, valueField]);

    const getGroupSelectedState = useCallback(
      (group: GroupOption<T>) => {
        const childIds = new Set(group.children.map(child => child[valueField]));
        const intersection = new Set([...selectedIds].filter(x => childIds.has(x)));

        if (intersection.size === 0) return 'none';
        if (intersection.size === group.children.length) return 'all';
        return 'partial';
      },
      [selectedIds, valueField]
    );

    const getSelectedInGroup = useCallback(
      (group: GroupOption<T>) => {
        return value.filter(v => group.children.some(child => child[valueField] === v[valueField]));
      },
      [value, valueField]
    );

    const displayValue = useMemo(() => {
      if (value.length === 0) {
        return showGroupNameWhenEmpty ? options.map(group => `${group.name} (All)`).join(', ') : placeholder;
      }

      const groupedSelections = options.map(group => ({
        group,
        selected: getSelectedInGroup(group),
      }));

      const displayParts = groupedSelections.map(({ group, selected }) => {
        if (selected.length === 0) {
          return `${group.name} (All)`;
        }
        if (selected.length === group.children.length) {
          return `${group.name} (All)`; // Changed this line to show (All) instead of count
        }
        if (selected.length <= 2) {
          return selected.map(item => String(item[displayField])).join(', ');
        }
        return `${group.name} (${selected.length})`;
      });

      return displayParts.join(', ') || placeholder;
    }, [value, options, getSelectedInGroup, placeholder, showGroupNameWhenEmpty, displayField]);

    const handleOpenChange = (open: boolean) => {
      if (disabled) {
        setIsOpen(false);
        return;
      }
      setIsOpen(open);
      if (open) setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      const relatedTarget = e.relatedTarget as Node | null;
      const isInsidePopover = popoverRef.current?.contains(relatedTarget);
      const isInsideCommandInput = relatedTarget instanceof Element && relatedTarget.closest('[cmdk-input-wrapper]');

      if (!isInsidePopover && !isInsideCommandInput) {
        setIsFocused(false);
        onBlur?.(e);
      }
    };

    const handleFocus = () => {
      if (!disabled) {
        setIsFocused(true);
      }
    };

    const handleClearAll = () => {
      if (disabled) return;
      onChange([]);
      setIsFocused(true);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideSelect = selectRef.current?.contains(target);
      const isInsidePopover = popoverRef.current?.contains(target);
      const isInsideCommandInput = target instanceof Element && target.closest('[cmdk-input-wrapper]');

      if (!isInsideSelect && !isInsidePopover && !isInsideCommandInput) {
        setIsFocused(false);
      }
    }, []);

    const getFormControlState = () => {
      if (disabled) return 'disabled';
      if (error) return isFocused ? 'errorFocused' : 'error';
      if (isFocused) return 'focused';
      return 'default';
    };

    const handleSelectAllInGroup = (group: GroupOption<T>, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (disabled) return;

      const currentSelection = new Set(value);
      group.children.forEach(child => {
        if (!selectedIds.has(child[valueField])) {
          currentSelection.add(child);
        }
      });
      onChange([...currentSelection]);
    };

    const handleDeselectAllInGroup = (group: GroupOption<T>, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (disabled) return;

      const groupIds = new Set(group.children.map(child => child[valueField]));
      onChange(value.filter(v => !groupIds.has(v[valueField])));
    };

    const handleGroupSelect = (group: GroupOption<T>) => {
      if (disabled) return;

      const groupState = getGroupSelectedState(group);
      if (groupState === 'all') {
        handleDeselectAllInGroup(group);
      } else {
        handleSelectAllInGroup(group);
      }
    };

    const handleOptionSelect = (option: T) => {
      if (disabled) return;

      if (selectedIds.has(option[valueField])) {
        onChange(value.filter(v => v[valueField] !== option[valueField]));
      } else {
        onChange([...value, option]);
      }
    };

    const handleRemoveTag = (option: T, e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onChange(value.filter(v => v[valueField] !== option[valueField]));
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (
      <div>
        <div
          ref={ref}
          className={cn(
            formControlVariants({
              size,
              state: getFormControlState(),
              className,
            })
          )}
        >
          <div ref={selectRef}>
            <Popover open={isOpen && !disabled} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <button
                  ref={triggerRef}
                  className={cn(triggerVariants({ size }), disabled && 'cursor-not-allowed')}
                  aria-expanded={isOpen}
                  disabled={disabled}
                  type="button"
                  onClick={() => !disabled && setIsFocused(true)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <ChevronDownIcon className={triggerIconVariants({ size, state: disabled ? 'disabled' : 'default' })} />
                  {label && <InputLabel label={label} required={required} size={size} className={cn(labelClassName)} />}
                  <p className={cn(contentVariants({ size }), !value.length && 'text-muted-foreground', disabled && 'opacity-50')}>{displayValue}</p>
                </button>
              </PopoverTrigger>
              <PopoverContent ref={popoverRef} className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  {showSearch && (
                    <CommandInput
                      placeholder={placeholder}
                      className={commandInputVariants({ size: 'default' })}
                      onFocus={() => setIsFocused(true)}
                    />
                  )}
                  <CommandList className="scrollbar max-h-[300px] overflow-auto">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {options.map(group => {
                      const groupState = getGroupSelectedState(group);
                      return (
                        <CommandGroup key={group.id} className="p-0">
                          <div className={groupHeaderVariants({ size })}>
                            <div className="flex flex-1 items-center justify-between">
                              <span>{group.name}</span>
                              <div className="text-muted-foreground flex gap-2 text-xs">
                                <button type="button" className="hover:text-primary cursor-pointer" onClick={e => handleSelectAllInGroup(group, e)}>
                                  Select all
                                </button>
                                <span>|</span>
                                <button type="button" className="hover:text-primary cursor-pointer" onClick={e => handleDeselectAllInGroup(group, e)}>
                                  Deselect all
                                </button>
                              </div>
                            </div>
                            <div className={cn(checkboxVariants({ size, selected: groupState }), 'ml-2')} onClick={() => handleGroupSelect(group)}>
                              <CheckIcon className={cn('text-primary-foreground h-3 w-3')} />
                            </div>
                          </div>
                          {group.children.map(option => (
                            <CommandItem
                              key={`${group.id}-${String(option[valueField])}`}
                              onSelect={() => handleOptionSelect(option)}
                              className={commandItemVariants({ size, selected: selectedIds.has(option[valueField]) })}
                            >
                              <span>{String(option[displayField])}</span>
                              <div className={checkboxVariants({ size, selected: selectedIds.has(option[valueField]) ? 'all' : 'none' })}>
                                <CheckIcon
                                  className={cn('text-primary-foreground h-3 w-3', {
                                    'opacity-0': !selectedIds.has(option[valueField]),
                                  })}
                                />
                              </div>
                            </CommandItem>
                          ))}
                          <Separator />
                        </CommandGroup>
                      );
                    })}
                  </CommandList>
                  {showClearAll && selectedIds.size > 0 && (
                    <>
                      <Separator />
                      <CommandGroup>
                        <Button className="w-full" size="sm" variant="secondary" onClick={handleClearAll}>
                          Clear all
                        </Button>
                      </CommandGroup>
                    </>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {showSelectedTags && (
          <div className={cn('mt-2 flex flex-wrap gap-1', tagListClassName)}>
            {groupedTags.map(({ group, selected, showAllTag }) => (
              <Fragment key={group.id}>
                {showAllTag ? (
                  <span className={tagVariants({ size: 'default' })}>
                    <span>{`${group.name} (All)`}</span>
                  </span>
                ) : (
                  selected.map(item => (
                    <span key={`${group.id}-${String(item[valueField])}`} className={tagVariants({ size: 'default' })}>
                      <span>{String(item[displayField])}</span>
                      <XIcon className={tagIconVariants({ size })} strokeWidth={2} onClick={e => handleRemoveTag(item, e)} />
                    </span>
                  ))
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SelectGroup.displayName = 'SelectGroup';

export { type SelectGroupProps };
