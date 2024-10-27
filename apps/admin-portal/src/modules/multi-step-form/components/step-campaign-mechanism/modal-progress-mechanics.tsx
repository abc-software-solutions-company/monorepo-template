import React, { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~react-web-ui-shadcn/components/ui/dialog';
import { Form } from '~react-web-ui-shadcn/components/ui/form';
import { Label } from '~react-web-ui-shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~react-web-ui-shadcn/components/ui/radio-group';

import FormFieldInput from '@/components/form-fields-yara/form-field-input';

import ConfigureTriggers from './configure-triggers';

import { CAMPAIGN_RULE, CAMPAIGN_TRIGGER_CONDITION, CAMPAIGN_TRIGGER_FIELD, CAMPAIGN_TRIGGER_PROPERTY } from '../../constants/campaign.constant';
import { CampaignMechanismFormValues, ConfigureProgressMechanicsFormValues } from '../../interfaces/campaign.interface';
import { configureProgressMechanicsSchema } from '../../validators/campaign-mechanism.validator';

type ModalProgressMechanicsProps = {
  form: UseFormReturn<CampaignMechanismFormValues>;
  visible: boolean;
  title: string;
  mode: 'add' | 'edit';
  editIndex?: number;
  onClose: () => void;
  onSave: (data: ConfigureProgressMechanicsFormValues, index?: number) => void;
};

const ModalProgressMechanics: React.FC<ModalProgressMechanicsProps> = ({ form, visible, title, mode, editIndex, onClose, onSave }) => {
  const isEditMode = mode === 'edit';
  const defaultValues: ConfigureProgressMechanicsFormValues = {
    name: '',
    campaignRule: CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE,
    triggers: [
      {
        property: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE,
        condition: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO,
        field: CAMPAIGN_TRIGGER_FIELD.B2B_SALES,
      },
    ],
  };

  const modalForm = useForm<ConfigureProgressMechanicsFormValues>({
    resolver: zodResolver(configureProgressMechanicsSchema),
    defaultValues,
  });

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

  const handleSubmit = async (data: ConfigureProgressMechanicsFormValues) => {
    try {
      onSave(data, isEditMode ? editIndex : undefined);
      onClose();
    } catch (error) {
      // console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-[70%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...modalForm}>
            <form className="frm-configure-triggers grid gap-3">
              <RadioGroup defaultValue={CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={CAMPAIGN_RULE.PRODUCT_SALES_OR_PURCHASE} id="campaign-sales-or-purchase" />
                  <Label htmlFor="campaign-sales-or-purchase">Product sales / purchase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={CAMPAIGN_RULE.CUSTOM} id="campaign-custom" />
                  <Label htmlFor="campaign-custom">Custom</Label>
                </div>
              </RadioGroup>
              <FormFieldInput form={modalForm} fieldName="name" formLabel="Rule" placeholder="Rule" />
              <ConfigureTriggers form={modalForm} />
              <div className="flex items-center justify-center gap-2">
                <button className="rounded bg-red-500 p-2 text-white hover:bg-red-600" type="button" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="rounded bg-primary-500 p-2 text-white hover:bg-primary-600"
                  type="button"
                  onClick={modalForm.handleSubmit(handleSubmit)}
                >
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
