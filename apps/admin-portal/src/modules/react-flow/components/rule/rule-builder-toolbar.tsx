import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

type RuleBuilderToolbarProps = {
  mode: 'create' | 'edit' | 'view';
  isLoading?: boolean;
  ruleConfigurationId?: string;
  onClose?: () => void;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RuleBuilderToolbar({ mode, isLoading, onClose, onSave, onEdit, onDelete }: RuleBuilderToolbarProps) {
  const handleDelete = async () => {
    onDelete?.();
  };

  const handleEdit = async () => {
    onEdit?.();
  };

  if (mode === 'view') {
    return (
      <div className="flex gap-2">
        <Button variant="outline-destructive" onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={handleEdit}>Edit</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline-destructive" onClick={onClose}>
        Close
      </Button>
      <Button disabled={isLoading} onClick={onSave}>
        {isLoading && <Loading thickness={2} size="icon" />}
        Save
      </Button>
    </div>
  );
}
