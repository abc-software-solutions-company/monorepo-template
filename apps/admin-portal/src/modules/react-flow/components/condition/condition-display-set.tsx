import React from 'react';

import ConditionSubSet from './condition-display-subset';
import ConditionOperator from './condition-operator';

import { ConditionFormValues, RuleSet } from '../../interfaces/condition.interface';

const ConditionSet: React.FC<{
  data: ConditionFormValues;
  set: RuleSet;
  index: number;
}> = ({ data, set, index }) => (
  <div key={index} className="flex flex-col gap-1">
    <div className="flex flex-wrap items-center gap-1">
      {set.subsets.map((subset, subsetIndex) => (
        <React.Fragment key={subset.facts[0].property}>
          <ConditionSubSet subset={subset} />
          {subsetIndex < set.subsets.length - 1 && <ConditionOperator text={subset.conditionType} variant="subset" />}
        </React.Fragment>
      ))}
    </div>
    {index < data.sets.length - 1 && (
      <div className="set-operator flex">
        <ConditionOperator text={set.conditionType.toUpperCase()} variant="set" />
      </div>
    )}
  </div>
);

export default ConditionSet;
