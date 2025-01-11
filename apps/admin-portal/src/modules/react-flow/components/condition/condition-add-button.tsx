import { FC } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

type ConditionAddButtonProps = {
  onClick?: () => void;
};

const ConditionAddButton: FC<ConditionAddButtonProps> = ({ onClick }) => (
  <Button variant="transparent" className="w-full" onClick={onClick}>
    <PlusIcon size={16} />
    <span>Add condition</span>
  </Button>
);

export default ConditionAddButton;
