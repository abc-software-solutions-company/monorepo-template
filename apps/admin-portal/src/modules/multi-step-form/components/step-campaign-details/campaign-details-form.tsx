import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import { CampaignDetailsFormValues } from '../../interfaces/campaign.interface';
import FormFieldInput from '../form-fields/form-field-input';
import FormFieldSelect from '../form-fields/form-field-select';
import FormFieldSelectTag from '../form-fields/form-field-select-tag';

type CampaignDetailsFormProps = {
  form: UseFormReturn<CampaignDetailsFormValues>;
  onSubmit: (data: CampaignDetailsFormValues) => void;
};

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({ form, onSubmit }) => {
  const options = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3' },
    { id: '4', label: 'Option 4' },
    { id: '5', label: 'Option 5' },
    { id: '6', label: 'Option 6' },
    { id: '7', label: 'Option 7' },
    { id: '8', label: 'Option 8' },
    { id: '9', label: 'Option 9' },
    { id: '10', label: 'Option 10' },
    { id: '11', label: 'Option 11' },
    { id: '12', label: 'Option 12' },
    { id: '13', label: 'Option 13' },
  ];

  return (
    <Form {...form}>
      <form className="frm-campaign-details" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-lg gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <FormFieldInput disabled form={form} fieldName="name" formLabel="Campaign name" placeholder="Enter name" required={true} />
              <FormFieldInput form={form} fieldName="name" formLabel="Campaign name" placeholder="Enter name" size="sm" required={true} />
            </div>
            <div className="grid gap-2">
              <FormFieldInput form={form} fieldName="description" formLabel="Campaign description" placeholder="Enter description" required={true} />
              <FormFieldInput
                disabled
                form={form}
                fieldName="description"
                formLabel="Campaign description"
                placeholder="Enter description"
                size="sm"
                required={true}
              />
            </div>
            <div className="grid gap-2">
              <FormFieldSelectTag
                disabled
                form={form}
                options={options}
                fieldName="products"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="label"
                valueField="id"
                required={true}
              />
              <FormFieldSelectTag
                disabled
                form={form}
                options={options}
                fieldName="products"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="label"
                valueField="id"
                size="sm"
                required={true}
              />
            </div>
            <div className="grid gap-2">
              <FormFieldSelect
                multiple
                form={form}
                options={options}
                fieldName="products"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="label"
                valueField="id"
                required={true}
                showSelectedTags={true}
              />
              <FormFieldSelect
                form={form}
                options={options}
                fieldName="products"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="label"
                valueField="id"
                size="sm"
                required={true}
              />
            </div>
          </div>
        </div>
        <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
      </form>
    </Form>
  );
};

export default CampaignDetailsForm;
