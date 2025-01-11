import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/react-web-ui-shadcn/components/ui/select';

interface IItemsPerPageProps {
  limit?: number;
  onFilter: (value: string) => void;
}

const ItemsPerPage: FC<IItemsPerPageProps> = ({ limit = 10, onFilter }) => {
  return (
    <Select value={limit.toString()} onValueChange={onFilter}>
      <SelectTrigger className="h-9 w-20">
        <SelectValue placeholder={limit} />
      </SelectTrigger>
      <SelectContent>
        {[5, 10, 20, 30, 40, 50, 100].map(pageSize => (
          <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ItemsPerPage;
