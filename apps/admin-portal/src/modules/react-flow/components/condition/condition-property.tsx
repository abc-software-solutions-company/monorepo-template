import ConditionBadge from './condition-badge';

const ConditionProperty: React.FC<{ text: string }> = ({ text }) => <ConditionBadge text={text} type="property" />;

export default ConditionProperty;
