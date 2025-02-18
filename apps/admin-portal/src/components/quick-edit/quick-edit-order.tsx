import { FC, useState } from 'react';
import { SaveIcon } from 'lucide-react';
import { Input } from '@repo/react-web-ui-shadcn/components/ahua/input';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

type QuickEditOrderCellProps = {
  initialValue: number;
  onSave: (value: number) => Promise<void> | void;
};

const QuickEditOrder: FC<QuickEditOrderCellProps> = ({ initialValue, onSave }) => {
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  const handleSave = async () => {
    if (value === initialValue) return;

    setIsUpdating(true);
    try {
      await onSave(value);
      setIsUpdateSuccess(true);
    } catch (error) {
      setIsUpdateSuccess(false);
      setValue(initialValue);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    setIsUpdateSuccess(false);
  };

  return (
    <div className="mx-auto inline-flex">
      <Input
        min={0}
        value={value}
        className="w-12 rounded-r-none"
        size="sm"
        onChange={e => {
          const newValue = parseInt(e.target.value);

          if (!isNaN(newValue)) {
            handleValueChange(newValue);
          }
        }}
      />
      <Button
        variant="outline"
        disabled={value === initialValue || isUpdating || isUpdateSuccess}
        className="rounded-l-none border border-l-0 px-3"
        onClick={handleSave}
      >
        {isUpdating ? <Loading size="icon" /> : <SaveIcon size={20} />}
      </Button>
    </div>
  );
};

export default QuickEditOrder;
