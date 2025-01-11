import { FC } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

type RuleOutcomeAddButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const RuleOutcomeAddButton: FC<RuleOutcomeAddButtonProps> = ({ disabled, onClick }) => {
  return (
    <Button variant="transparent" className="w-full" disabled={disabled} onClick={onClick}>
      <PlusIcon size={16} />
      <span>Add outcome</span>
    </Button>
  );
};

export default RuleOutcomeAddButton;
