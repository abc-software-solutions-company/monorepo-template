import React from 'react';

import ConditionDisplayFact from './condition-display-fact';
import ConditionOperator from './condition-operator';

import { Subset } from '../../interfaces/condition.interface';

const ConditionSubSet: React.FC<{ subset: Subset }> = ({ subset }) => (
  <div className="d-subset inline-flex rounded-xl border border-gray-200 p-0.5">
    <div className="flex gap-1">
      <span className="inline-flex flex-wrap gap-1">
        {subset.facts.map((fact, factIndex) => (
          <React.Fragment key={fact.property}>
            <ConditionDisplayFact fact={fact} />
            {factIndex < subset.facts.length - 1 && <ConditionOperator text={subset.facts[0].conditionType} variant="fact" />}
          </React.Fragment>
        ))}
      </span>
    </div>
  </div>
);

export default ConditionSubSet;
