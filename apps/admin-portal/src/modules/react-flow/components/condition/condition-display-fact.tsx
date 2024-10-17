import ConditionProperty from './condition-property';

import { Fact } from '../../interfaces/condition.interface';

const ConditionDisplayFact: React.FC<{ fact: Fact }> = ({ fact }) => (
  <span key={fact.property} className="inline-flex">
    <ConditionProperty text={fact.property} />
  </span>
);

export default ConditionDisplayFact;
