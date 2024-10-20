import React, { useEffect, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { TRIGGER_CONDITION, TRIGGER_FIELD, TRIGGER_PROPERTY } from '../../constants/campaign.constant';
import { CampaignMechanicFormValues } from '../../interfaces/campaign.interface';

type ConfigureTriggersProps = {
  form: UseFormReturn<CampaignMechanicFormValues>;
};

const ConfigureTriggers: React.FC<ConfigureTriggersProps> = ({ form }) => {
  const { fields: triggerItems, append, remove } = useFieldArray({ control: form.control, name: 'triggers' });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const handlePropertyChange = (index: number, value: string) => {
    const newSelectedProperties = [...selectedProperties];

    newSelectedProperties[index] = value;
    setSelectedProperties(newSelectedProperties);

    form.setValue(`triggers.${index}.condition`, '');
    form.setValue(`triggers.${index}.field`, '');
    form.setValue(`triggers.${index}.amount`, 0);
    form.setValue(`triggers.${index}.sku`, { productFamily: '', productVariant: '' });
    form.setValue(`triggers.${index}.quantity`, 0);
    form.setValue(`triggers.${index}.custom`, '');
  };

  useEffect(() => {
    const initialProperties = form.getValues('triggers').map(trigger => trigger.property);

    setSelectedProperties(initialProperties);
  }, [form]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="font-bold">Configure triggers</label>
        <button
          type="button"
          className="bg-primary-500 p-2 text-white"
          onClick={() => {
            append({ property: '', condition: '' });
          }}
        >
          Add trigger
        </button>
      </div>
      {triggerItems.map((field, index) => {
        return (
          <div key={field.id} className="flex items-center space-x-2 rounded bg-gray-100 p-2">
            <select
              {...form.register(`triggers.${index}.property`)}
              className="rounded border p-1"
              onChange={e => handlePropertyChange(index, e.target.value)}
            >
              <option value="">Select property</option>
              <option value={TRIGGER_PROPERTY.TRANSACTION_TYPE}>Transaction type</option>
              <option value={TRIGGER_PROPERTY.AMOUNT}>Amount</option>
              <option value={TRIGGER_PROPERTY.SKU}>SKU</option>
              <option value={TRIGGER_PROPERTY.QUANTITY}>Quantity</option>
              <option value={TRIGGER_PROPERTY.CUSTOM}>Custom</option>
            </select>
            <select {...form.register(`triggers.${index}.condition`)} className="rounded border p-1">
              <option value="">Select condition</option>
              <option value={TRIGGER_CONDITION.EQUALS_TO}>Equals to</option>
              <option value={TRIGGER_CONDITION.NOT_EQUALS_TO}>Not equals to</option>
              <option value={TRIGGER_CONDITION.MORE_THAN}>More than</option>
              <option value={TRIGGER_CONDITION.LESS_THAN}>Less than</option>
            </select>
            {selectedProperties[index] === TRIGGER_PROPERTY.TRANSACTION_TYPE && (
              <select {...form.register(`triggers.${index}.field`)} className="rounded border p-1">
                <option value="">Select field</option>
                <option value={TRIGGER_FIELD.B2B_SALES}>B2B sales</option>
                <option value={TRIGGER_FIELD.B2B_PURCHASE}>B2B purchase</option>
                <option value={TRIGGER_FIELD.B2C}>B2C</option>
                <option value={TRIGGER_FIELD.QR_SCAN}>QR scan</option>
                <option value={TRIGGER_FIELD.RECEIPT}>Receipt</option>
              </select>
            )}
            {selectedProperties[index] === TRIGGER_PROPERTY.AMOUNT && (
              <input
                type="number"
                {...form.register(`triggers.${index}.amount`, { valueAsNumber: true })}
                className="rounded border p-1"
                placeholder="Enter amount"
              />
            )}
            {selectedProperties[index] === TRIGGER_PROPERTY.SKU && (
              <>
                <input {...form.register(`triggers.${index}.sku.productFamily`)} className="rounded border p-1" placeholder="Product family" />
                <input {...form.register(`triggers.${index}.sku.productVariant`)} className="rounded border p-1" placeholder="Product variant" />
              </>
            )}
            {selectedProperties[index] === TRIGGER_PROPERTY.QUANTITY && (
              <input
                type="number"
                {...form.register(`triggers.${index}.quantity`, { valueAsNumber: true })}
                className="rounded border p-1"
                placeholder="Enter quantity"
              />
            )}
            {selectedProperties[index] === TRIGGER_PROPERTY.CUSTOM && (
              <input {...form.register(`triggers.${index}.custom`)} className="rounded border p-1" placeholder="<Input>" />
            )}
            <button
              className="bg-red-500 p-2 text-white"
              type="button"
              onClick={() => {
                remove(index);
                setSelectedProperties(prev => prev.filter((_, i) => i !== index));
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ConfigureTriggers;
