import React from 'react';

import ConditionSet from './condition-display-set';

import { ConditionFormValues } from '../../interfaces/condition.interface';

type ConditionDisplayProps = {
  data: ConditionFormValues;
  onClick?: () => void;
};

const ConditionDisplay: React.FC<ConditionDisplayProps> = ({ data, onClick }) => {
  return (
    <div
      className="d-set flex flex-col gap-1"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' && onClick) {
          onClick();
        }
      }}
    >
      {data.sets.map((set, index) => (
        <ConditionSet key={index} data={data} set={set} index={index} />
      ))}
    </div>
  );
};

export default ConditionDisplay;
