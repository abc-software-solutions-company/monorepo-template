import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@repo/react-web-ui-shadcn/components/ui/dropdown-menu';

type DataTableRowActionProps<T> = {
  onAction?: (action: T) => void;
  items: { label: string; action: T }[];
};

export default function DataTableRowAction<T>({ onAction, items }: DataTableRowActionProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'secondary'} className="flex h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              setIsOpen(false);
              onAction?.(item.action);
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
