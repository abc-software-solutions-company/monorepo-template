import ConditionBadge from './condition-badge';

type OperatorVariant = 'fact' | 'subset' | 'set';

const ConditionOperator: React.FC<{
  text: string;
  variant: OperatorVariant;
}> = ({ text, variant }) => <ConditionBadge text={text} type="operator" variant={variant} />;

export default ConditionOperator;
