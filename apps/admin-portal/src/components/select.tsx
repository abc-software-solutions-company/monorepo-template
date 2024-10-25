import React, { FC, ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, ChevronDownIcon, InfoIcon, XIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~react-web-ui-shadcn/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~react-web-ui-shadcn/components/ui/popover';
import { Separator } from '~react-web-ui-shadcn/components/ui/separator';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from '~react-web-ui-shadcn/components/ui/tooltip';
import { cn } from '~react-web-ui-shadcn/lib/utils';

const selectVariants = cva('h-6 relative rounded-md border border-input bg-background ring-input', {
  variants: {
    size: {
      default: 'h-14',
      sm: 'h-10',
    },
    state: {
      default: '',
      focused: 'ring-2 ring-ring ring-offset-2 ring-offset-background',
      disabled: 'cursor-not-allowed bg-muted',
    },
  },
  defaultVariants: {
    size: 'default',
    state: 'default',
  },
});

const labelVariants = cva('block text-muted-foreground px-3 font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    size: {
      default: '!leading-[26px] text-[12px]',
      sm: '!leading-[16px] text-[10px]',
    },
  },
  defaultVariants: {
    size: 'default',
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

const triggerVariants = cva('grid w-full justify-between focus:outline-none', {
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

const commandItemVariants = cva('flex items-center justify-between rounded-none', {
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

const commandIconVariants = cva('mr-2 flex items-center justify-center rounded-sm border border-primary', {
  variants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-3 w-3',
    },
    selected: {
      true: 'bg-primary text-primary-foreground',
      false: 'opacity-50 [&_svg]:invisible',
    },
  },
  defaultVariants: {
    size: 'default',
    selected: false,
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

type TagProps = {
  className?: string;
  label: string;
  value: string;
  size?: 'default' | 'sm';
  onRemove: (value: string, e: React.MouseEvent) => void;
};

const Tag: FC<TagProps> = ({ className, label, value, size = 'default', onRemove }) => (
  <span className={cn(tagVariants({ size }), className)}>
    {label}
    <XIcon className={tagIconVariants({ size })} strokeWidth={2} onClick={e => onRemove(value, e)} />
  </span>
);

type LabelProps = {
  className?: string;
  label: string;
  required?: boolean;
  size?: 'default' | 'sm';
};

const Label: FC<LabelProps> = ({ className, label, required, size = 'default' }) => (
  <label className={cn(labelVariants({ size }), className)}>
    {label}
    {required && <span className="ml-0.5 text-destructive">*</span>}
  </label>
);

type OptionType = Record<string, string>;

type SelectProps<T extends OptionType> = {
  className?: string;
  options: T[];
  placeholder?: string;
  label?: string;
  labelClassName?: string;
  tagListClassName?: string;
  tagItemClassName?: string;
  required?: boolean;
  disabled?: boolean;
  valueField: keyof T;
  displayField: keyof T;
  multiple?: boolean;
  size?: 'default' | 'sm';
  showSearch?: boolean;
  showClearAll?: boolean;
  showSelectedTags?: boolean;
  value: T[];
  onChange: (value: T[]) => void;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
} & VariantProps<typeof selectVariants>;

const Select = forwardRef(
  <T extends OptionType>(
    {
      className,
      labelClassName,
      tagListClassName,
      tagItemClassName,
      options,
      value,
      valueField,
      displayField,
      placeholder = 'Select items...',
      disabled = false,
      label,
      required = false,
      multiple = false,
      size = 'default',
      showSearch = false,
      showClearAll = false,
      showSelectedTags = false,
      onChange,
      onBlur,
    }: SelectProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedValues = useMemo(() => {
      return new Set(value.map(item => item[valueField]));
    }, [value, valueField]);

    const selectedItems = useMemo(() => options.filter(option => selectedValues.has(option[valueField])), [options, selectedValues, valueField]);

    const handleToggleOption = (option: T) => {
      if (disabled) return;

      if (multiple) {
        const newItems = selectedValues.has(option[valueField])
          ? selectedItems.filter(item => item[valueField] !== option[valueField])
          : [...selectedItems, option];

        onChange(newItems);
      } else {
        onChange([option]);
        setIsOpen(false);
      }

      setIsFocused(true);
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    const handleClearAll = () => {
      if (disabled) return;
      onChange([]);
      setIsFocused(true);
    };

    const handleOpenChange = (open: boolean) => {
      if (disabled) {
        setIsOpen(false);

        return;
      }

      setIsOpen(open);
      if (open) setIsFocused(true);
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

    const handleRemoveTag = (tagValue: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      const newItems = selectedItems.filter(item => item[valueField] !== tagValue);

      onChange(newItems);
      setIsFocused(true);
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
            selectVariants({
              size,
              state: disabled ? 'disabled' : isFocused ? 'focused' : 'default',
              className,
            })
          )}
        >
          <div ref={selectRef}>
            <Popover open={isOpen && !disabled} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <div>
                  <ChevronDownIcon className={triggerIconVariants({ size: 'default', state: disabled ? 'disabled' : 'default' })} />
                  {label && <Label label={label} required={required} size={size} className={cn(labelClassName)} />}
                  <button
                    ref={triggerRef}
                    className={cn(triggerVariants({ size }), disabled && 'cursor-not-allowed')}
                    role="combobox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    type="button"
                    tabIndex={0}
                    onClick={() => !disabled && setIsFocused(true)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                  >
                    <p className={cn(contentVariants({ size }), selectedItems.length === 0 && 'text-muted-foreground', disabled && 'opacity-50')}>
                      {selectedItems.length === 0 && selectedItems.map(item => item[displayField]).join(', ')}
                      {selectedItems.length > 0 && selectedItems.map(item => item[displayField]).join(', ')}
                    </p>
                  </button>
                </div>
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
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup className="p-0">
                      {options.map(option => {
                        const isSelected = selectedValues.has(option[valueField]);

                        return (
                          <CommandItem
                            key={option[valueField]}
                            className={cn(commandItemVariants({ size: 'default', selected: isSelected }))}
                            onSelect={() => handleToggleOption(option)}
                          >
                            <div className="flex items-center">
                              {multiple && (
                                <div className={commandIconVariants({ size: 'default', selected: isSelected })}>
                                  <CheckIcon />
                                </div>
                              )}
                              <span>{option[displayField]}</span>
                            </div>
                            {option.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <InfoIcon size={18} className="text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent className="whitespace-pre-line break-words border-black bg-black text-white">
                                    <p>{option.tooltip}</p>
                                    <TooltipArrow className="fill-black" />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                  {showClearAll && selectedValues.size > 0 && (
                    <>
                      <Separator />
                      <CommandGroup>
                        <CommandItem className={cn('justify-center text-center', commandItemVariants({ size: 'default' }))} onSelect={handleClearAll}>
                          Clear all
                        </CommandItem>
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
            {selectedItems.map(item => (
              <Tag
                key={item[valueField]}
                className={tagItemClassName}
                label={item[displayField]}
                value={item[valueField]}
                size={size}
                onRemove={handleRemoveTag}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
