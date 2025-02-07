import React, { useEffect } from 'react';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldRadioBlock from '@repo/react-web-ui-shadcn/components/form-fields/form-field-radio-block';
import FormFieldSelect from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import ConfigureTriggers from './configure-triggers';

import {
  CAMPAIGN_RULE,
  CAMPAIGN_TRACKER_TYPE,
  CAMPAIGN_TRACKER_TYPE_LIST,
  CAMPAIGN_TRIGGER_CONDITION,
  CAMPAIGN_TRIGGER_PROPERTY,
} from '../../constants/campaign.constant';
import { RuleFormValues } from '../../interfaces/campaign.interface';
import { ruleSchema } from '../../validators/campaign-step-3.validator';

type ModalRulesProps = {
  form: UseFormReturn<{ rules: RuleFormValues[] }>;
  visible: boolean;
  editIndex: number;
  onSave: (data: RuleFormValues, index: number) => void;
  onClose: () => void;
};

const defaultValues: RuleFormValues = {
  ruleName: '',
  campaignRule: CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE,
  trackerType: CAMPAIGN_TRACKER_TYPE.PRORATED,
  trackerValue: '',
  triggers: [
    {
      property: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE,
      condition: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO,
    },
  ],
};

const ModalRules: React.FC<ModalRulesProps> = ({ form, visible, editIndex, onClose, onSave }) => {
  const rules = form.watch('rules');
  const isEditMode = editIndex !== -1;

  const modalForm = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEditMode) {
      const editData = rules[editIndex];

      modalForm.reset({
        ruleName: editData.ruleName,
        triggers: editData.triggers,
        campaignRule: editData.campaignRule,
        trackerType: editData.trackerType,
        trackerValue: editData.trackerValue,
      });
    } else {
      modalForm.reset(defaultValues);
    }
  }, [isEditMode, editIndex, modalForm, visible, rules]);

  const onSubmit: SubmitHandler<RuleFormValues> = async data => {
    onSave(data, isEditMode ? editIndex : -1);
    onClose();
  };

  return (
    <Dialog open={visible} modal={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-7xl">
        <Form {...modalForm}>
          <form>
            <DialogHeader>
              <DialogTitle>Configure progress mechanics</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Configure progress mechanics</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <Separator />
            <div className="p-4" tabIndex={0}>
              <div className="max-w-lg">
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
              <FormFieldInput
                required
                className="mt-4"
                size="sm"
                form={modalForm}
                fieldName="ruleName"
                formLabel="Rule name"
                placeholder="Enter rule name"
              />
              <div className="mt-4 rounded-lg border p-3" tabIndex={1}>
                <ConfigureTriggers form={modalForm} />
              </div>
              <div className="mt-4 flex items-center space-x-4" tabIndex={2}>
                <Label>Outcome</Label>
                <FormFieldSelect
                  required
                  className="min-w-40"
                  form={modalForm}
                  size="sm"
                  fieldName="trackerType"
                  formLabel="Tracker type"
                  placeholder="Select type"
                  showErrorMessage={false}
                  options={CAMPAIGN_TRACKER_TYPE_LIST}
                />
                <FormFieldInput
                  required
                  className="min-w-40"
                  size="sm"
                  form={modalForm}
                  fieldName="trackerValue"
                  formLabel="Tracker value"
                  placeholder="Enter tracker value"
                  showErrorMessage={false}
                />
              </div>
            </div>
            <Separator />
            <DialogFooter className="!justify-center">
              <Button className="min-w-28" type="button" variant="outline-destructive" onClick={onClose}>
                Cancel
              </Button>
              <Button className="min-w-28" type="button" onClick={modalForm.handleSubmit(onSubmit)}>
                {isEditMode ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
            <pre className="overflow-hidden rounded-md border-slate-200 p-2 text-xs">{JSON.stringify(modalForm.watch(), null, 2)}</pre>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRules;
