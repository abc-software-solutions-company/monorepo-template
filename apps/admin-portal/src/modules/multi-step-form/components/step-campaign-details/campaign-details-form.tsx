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
    {
      id: '1',
      name: 'Option 1',
      tooltip: 'Expiry period\nStart: 2023-01-01\nEnd: 2023-12-31\n\nRepeat annually:\nYes\n\nDescription:\nThis is a description',
    },
    { id: '2', name: 'Option 2', tooltip: '' },
    { id: '3', name: 'Option 3', tooltip: '' },
    { id: '4', name: 'Option 4', tooltip: '' },
    { id: '5', name: 'Option 5', tooltip: '' },
    { id: '6', name: 'Option 6', tooltip: 'Hello' },
    { id: '7', name: 'Option 7', tooltip: 'Line 1\nLine 2\nLine 3' },
    { id: '8', name: 'Option 8', tooltip: '' },
    { id: '9', name: 'Option 9', tooltip: '' },
    { id: '10', name: 'Option 10', tooltip: '' },
    { id: '11', name: 'Option 11', tooltip: '' },
    { id: '12', name: 'Option 12', tooltip: '' },
    { id: '13', name: 'Option 13', tooltip: '' },
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
                form={form}
                options={options}
                fieldName="products"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="name"
                valueField="id"
                required={true}
              />
              <FormFieldSelectTag
                form={form}
                options={options}
                fieldName="products"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="name"
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
                displayField="name"
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
                displayField="name"
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
