import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Label } from '~react-web-ui-shadcn/components/ui/label';

import FormFieldSelect from '@/components/form-fields-ahua/form-field-select';

import { CAMPAIGN_TRIGGER_CONDITION, CAMPAIGN_TRIGGER_PROPERTY } from '../../constants/campaign.constant';

type ConfigureTriggersProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
};

const ConfigureTriggers: React.FC<ConfigureTriggersProps> = ({ form }) => {
  const { fields: triggerItems, append, remove } = useFieldArray({ control: form.control, name: 'triggers' });

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>Configure triggers</Label>
        <Button
          type="button"
          className="bg-primary-500 p-2 text-white"
          onClick={() => {
            append({ property: '', condition: '' });
          }}
        >
          Add trigger
        </Button>
      </div>
      {triggerItems.map((field, index) => {
        return (
          <div key={field.id} className="flex items-center space-x-2 rounded bg-gray-100 p-2">
            <FormFieldSelect
              size="sm"
              form={form}
              fieldName={`triggers.${index}.property`}
              formLabel="Select property"
              options={[
                { id: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE, name: 'Transaction type' },
                { id: CAMPAIGN_TRIGGER_PROPERTY.AMOUNT, name: 'Amount' },
                { id: CAMPAIGN_TRIGGER_PROPERTY.SKU, name: 'SKU' },
                { id: CAMPAIGN_TRIGGER_PROPERTY.QUANTITY, name: 'Quantity' },
                { id: CAMPAIGN_TRIGGER_PROPERTY.CUSTOM, name: 'Custom' },
              ]}
            />
            <FormFieldSelect
              size="sm"
              form={form}
              fieldName={`triggers.${index}.condition`}
              formLabel="Select condition"
              options={[
                { id: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO, name: 'Equals to' },
                { id: CAMPAIGN_TRIGGER_CONDITION.NOT_EQUALS_TO, name: 'Not equals to' },
                { id: CAMPAIGN_TRIGGER_CONDITION.MORE_THAN, name: 'More than' },
                { id: CAMPAIGN_TRIGGER_CONDITION.LESS_THAN, name: 'Less than' },
              ]}
            />
            <Button
              className="bg-red-500 p-2 text-white"
              type="button"
              onClick={() => {
                remove(index);
              }}
            >
              Remove
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ConfigureTriggers;
