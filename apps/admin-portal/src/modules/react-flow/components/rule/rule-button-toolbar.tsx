import { FC } from 'react';

import RuleButtonEdit from './rule-button-edit';
import RuleButtonRemove from './rule-button-remove';

type RuleToolbarProps = {
  className?: string;
  visible?: boolean;
  editDisabled?: boolean;
  removeDisabled?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
};

const RuleToolbar: FC<RuleToolbarProps> = ({ visible = true, editDisabled = false, removeDisabled = false, onEdit, onRemove }) => {
  if (!visible) return null;

  return (
    <div className="absolute -right-3 -top-4 flex rounded-full border bg-background leading-0">
      <RuleButtonRemove disabled={removeDisabled} className="px-1 py-0.5" onClick={onRemove} />
      <RuleButtonEdit disabled={editDisabled} className="px-1 py-0.5" onClick={onEdit} />
    </div>
  );
};

export default RuleToolbar;
