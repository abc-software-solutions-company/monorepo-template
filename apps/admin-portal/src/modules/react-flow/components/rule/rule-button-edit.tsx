import { FC } from 'react';
import classNames from 'classnames';
import { PenIcon } from 'lucide-react';

type RuleButtonEditProps = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const RuleButtonEdit: FC<RuleButtonEditProps> = ({ className, disabled, onClick }) => {
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
      <PenIcon size={16} className="text-primary" />
    </button>
  );
};

export default RuleButtonEdit;
