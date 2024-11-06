import React, { useEffect } from 'react';
import { Form, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~react-web-ui-shadcn/components/ui/dialog';

import FormFieldInput from '@/components/form-fields-ahua/form-field-input';
import FormFieldRadioBlock from '@/components/form-fields-ahua/form-field-radio-block';

import ConfigureTriggers from './configure-triggers';

import { CAMPAIGN_RULE, CAMPAIGN_TRIGGER_CONDITION, CAMPAIGN_TRIGGER_PROPERTY } from '../../constants/campaign.constant';
import { campaignStep3Schema } from '../../validators/campaign-step-3.validator';

type ModalProgressMechanicsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  visible: boolean;
  editIndex?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any, index?: number) => void;
  onClose: () => void;
};

const ModalProgressMechanics: React.FC<ModalProgressMechanicsProps> = ({ form, visible, editIndex, onClose, onSave }) => {
  const progressMechanics = form.watch('progressMechanics');

  const isEditMode = editIndex !== undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultValues: any = {
    ruleName: isEditMode ? progressMechanics[editIndex].ruleName : '',
    campaignRule: isEditMode ? progressMechanics[editIndex].campaignRule : CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE,
    triggers: isEditMode
      ? progressMechanics[editIndex].triggers
      : [
          {
            property: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE,
            condition: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO,
          },
        ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modalForm = useForm<any>({ resolver: zodResolver(campaignStep3Schema), defaultValues });

  useEffect(() => {
    if (visible) {
      if (isEditMode) {
        const editData = progressMechanics[editIndex];

        modalForm.reset({
          ruleName: editData.ruleName,
          campaignRule: editData.campaignRule,
          triggers: editData.triggers,
        });
      } else {
        modalForm.reset(defaultValues);
      }
    }
  }, [form, isEditMode, editIndex, visible, modalForm]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (data: any) => {
    onSave(data, isEditMode ? editIndex : undefined);
    onClose();
  };

  return (
    <Dialog open={visible} modal={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl">
        <DialogHeader>
          <DialogTitle>Configure progress mechanics</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Configure progress mechanics</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <Form {...modalForm}>
          <form className="space-y-4">
            <div className="max-w-lg space-y-4">
              <FormFieldRadioBlock
                form={modalForm}
                fieldName="campaignRule"
                formLabel="Campaign Rule"
                options={[
                  { value: CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE, label: 'Product sales / purchase' },
                  { value: CAMPAIGN_RULE.CUSTOM, label: 'Custom' },
                ]}
              />
            </div>
            <FormFieldInput size="sm" form={modalForm} fieldName="ruleName" formLabel="Enter rule name" />
            <ConfigureTriggers form={modalForm} />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => handleSave(modalForm.getValues())}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProgressMechanics;
