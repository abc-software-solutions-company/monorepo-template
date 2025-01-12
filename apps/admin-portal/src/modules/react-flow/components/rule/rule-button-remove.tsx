import { FC } from 'react';
import classNames from 'classnames';
import { Trash2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/react-web-ui-shadcn/components/ui/tooltip';

type RuleButtonRemoveProps = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const RuleButtonRemove: FC<RuleButtonRemoveProps> = ({ className, disabled, onClick }) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      className={classNames(disabled && 'cursor-not-allowed text-gray-100 opacity-50', className)}
      disabled={disabled}
      onClick={handleClick}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Trash2Icon size={16} className="text-red-500" />
          </TooltipTrigger>
          {disabled && (
            <TooltipContent>
              <p>This node can not be deleted</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </button>
  );
};

export default RuleButtonRemove;
