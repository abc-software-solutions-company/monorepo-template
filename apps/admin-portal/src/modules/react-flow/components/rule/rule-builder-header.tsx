import { ArrowLeftIcon, PenIcon } from 'lucide-react';

type RuleBuilderHeaderProps = {
  mode: 'create' | 'edit' | 'view';
  ruleName: string;
  onBack: () => void;
  onRename?: () => void;
};

export function RuleBuilderHeader({ mode, ruleName, onBack, onRename }: RuleBuilderHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onBack}>
        <ArrowLeftIcon size={24} className="text-primary" />
      </button>
      <h3 className="font-bold">{ruleName}</h3>
      {mode !== 'view' && ruleName && (
        <button type="button" onClick={onRename}>
          <PenIcon size={18} className="text-primary" />
        </button>
      )}
    </div>
  );
}
