import React, { useEffect } from 'react';
import { Form, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~react-web-ui-shadcn/components/ui/dialog';

import ConfigureTriggers from './configure-triggers';

import { CAMPAIGN_RULE } from '../../constants/campaign.constant';
import { CampaignMechanicFormValues, ProgressMechanicsValues } from '../../interfaces/campaign.interface';
import { campaignMechanicSchema } from '../../validators/campaign-mechanism.validator';
import FormFieldInput from '../form-fields/form-field-input';
import FormFieldRadioBlock from '../form-fields/form-field-radio-block';

type ModalProgressMechanicsProps = {
  form: UseFormReturn<ProgressMechanicsValues>;
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: (data: CampaignMechanicFormValues, index?: number) => void;
  mode: 'add' | 'edit';
  editIndex?: number;
};

const ModalProgressMechanics: React.FC<ModalProgressMechanicsProps> = ({ form, visible, title, mode, editIndex, onClose, onSave }) => {
  const isEditMode = mode === 'edit';
  const defaultValues: CampaignMechanicFormValues = {
    name: '',
    campaignRule: CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE,
    triggers: [{ property: 'transaction_type', condition: 'equals_to', field: 'b2b_sales' }],
  };

  const modalForm = useForm<CampaignMechanicFormValues>({ resolver: zodResolver(campaignMechanicSchema), defaultValues });

  useEffect(() => {
    if (visible) {
      if (isEditMode && editIndex !== undefined) {
        const editData = form.getValues(`progressMechanics.${editIndex}`);

        modalForm.reset({
          name: editData.name,
          campaignRule: editData.campaignRule,
          triggers: editData.triggers,
        });
      } else {
        modalForm.reset(defaultValues);
      }
    }
  }, [form, isEditMode, editIndex, visible, modalForm]);

  const handleSave = (data: CampaignMechanicFormValues) => {
    onSave(data, isEditMode ? editIndex : undefined);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-[70%]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...modalForm}>
            <form className="frm-configure-triggers grid gap-3">
              <FormFieldRadioBlock
                form={modalForm}
                fieldName="campaignRule"
                formLabel="Campaign Rule"
                items={[
                  { id: CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE, label: 'Product sales / purchase' },
                  { id: CAMPAIGN_RULE.CUSTOM, label: 'Custom' },
                ]}
              />
              <FormFieldInput form={modalForm} fieldName="name" formLabel="Rule" placeholder="Rule" />
              <ConfigureTriggers form={modalForm} />
              <div className="flex items-center justify-center gap-2">
                <button className="bg-red-500 p-2 text-white" type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className="bg-primary-500 p-2 text-white" type="button" onClick={modalForm.handleSubmit(handleSave)}>
                  {isEditMode ? 'Save Changes' : 'Add Mechanic'}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProgressMechanics;
