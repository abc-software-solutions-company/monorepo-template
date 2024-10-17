import React, { FC } from 'react';
import classNames from 'classnames';
import { MinusIcon } from 'lucide-react';

type RuleHeaderProps = {
  className?: string;
  name: string;
  isCollapsed: boolean;
  onCollapse: () => void;
};

const RuleHeader: FC<RuleHeaderProps> = ({ className, name, isCollapsed, onCollapse }) => {
  return (
    <div
      className={classNames(
        'node-header flex items-center justify-between px-3 py-2 text-white',
        isCollapsed ? 'rounded-lg' : 'rounded-t-lg',
        className
      )}
    >
      <h2 className="font-bold">{name}</h2>
      <button onClick={onCollapse}>
        <MinusIcon size={16} />
      </button>
    </div>
  );
};

export default RuleHeader;
