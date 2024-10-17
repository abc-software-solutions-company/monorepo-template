import { FC } from 'react';

import ConditionAddButton from './condition-add-button';
import ConditionDisplay from './condition-display';
import ConditionEmpty from './condition-empty';

import { ConditionFormValues } from '../../interfaces/condition.interface';

type ConditionContentProps = {
  isViewMode?: boolean;
  conditions?: ConditionFormValues;
  onClick?: () => void;
};

const ConditionContent: FC<ConditionContentProps> = ({ isViewMode, conditions, onClick }) => {
  return conditions ? (
    <ConditionDisplay data={conditions} onClick={onClick} />
  ) : (
    <>{isViewMode ? <ConditionEmpty /> : <ConditionAddButton onClick={onClick} />}</>
  );
};

export default ConditionContent;
