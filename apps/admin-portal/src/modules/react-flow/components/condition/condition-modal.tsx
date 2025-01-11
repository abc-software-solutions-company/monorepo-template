import { useEffect, useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { useReactFlow } from '@xyflow/react';

import ConditionBuilder from './condition-builder';

import { ConditionFormValues } from '../../interfaces/condition.interface';
import { RuleNode } from '../../interfaces/rule.interface';

interface IConditionModalProps {
  isOpen: boolean;
  ruleId: string;
  onClose: () => void;
  onSubmit?: (data: ConditionFormValues) => void;
}

export default function ConditionModal({ isOpen, ruleId, onClose, onSubmit }: IConditionModalProps) {
  const { getNode } = useReactFlow<RuleNode>();
  const [currentCondition, setCurrentCondtion] = useState<ConditionFormValues | undefined>(undefined);

  useEffect(() => {
    if (isOpen && ruleId) {
      const node = getNode(ruleId);

      if (node) {
        setCurrentCondtion(node.data.conditions);
      }
    }
  }, [isOpen, ruleId, getNode]);

  const handleSave = (value: ConditionFormValues) => {
    onSubmit?.(value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl" showCloseButton={false}>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Condition</DialogTitle>
            <DialogDescription>Condition Builder</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <div className="p-3">
          <ConditionBuilder initialValue={currentCondition} onSave={handleSave} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
