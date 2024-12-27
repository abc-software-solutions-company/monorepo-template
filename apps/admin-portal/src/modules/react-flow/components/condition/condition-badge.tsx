type BadgeType = 'property' | 'operator';
type OperatorVariant = 'fact' | 'subset' | 'set';

const ConditionBadge: React.FC<{
  text: string;
  type: BadgeType;
  variant?: OperatorVariant;
}> = ({ text, type, variant }) => {
  const operatorColors = {
    fact: 'border border-slate-300 bg-slate-100 text-slate-800',
    subset: 'border border-green-300 bg-green-100 text-green-800',
    set: 'border border-amber-300 bg-amber-100 text-amber-600 font-bold',
  };

  const baseStyle = 'inline-flex px-1.5 py-0.5 rounded-full text-xs border items-center max-h-[20px]';
  const colorStyle = type === 'operator' ? operatorColors[variant || 'fact'] : 'border-blue-300 bg-blue-300/20 text-blue-700';

  return <span className={`${baseStyle} ${colorStyle}`}>{text}</span>;
};

export default ConditionBadge;
