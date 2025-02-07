import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import FormFieldSelect from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';

import { CAMPAIGN_TRIGGER_CONDITION, CAMPAIGN_TRIGGER_PROPERTY } from '../../constants/campaign.constant';
import { RuleFormValues } from '../../interfaces/campaign.interface';

const propertyOptions = [
  { id: CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE, name: 'Transaction type' },
  { id: CAMPAIGN_TRIGGER_PROPERTY.AMOUNT, name: 'Amount' },
  { id: CAMPAIGN_TRIGGER_PROPERTY.SKU, name: 'SKU' },
  { id: CAMPAIGN_TRIGGER_PROPERTY.QUANTITY, name: 'Quantity' },
  { id: CAMPAIGN_TRIGGER_PROPERTY.CUSTOM, name: 'Custom' },
];

const conditionOptions = [
  { id: CAMPAIGN_TRIGGER_CONDITION.EQUALS_TO, name: 'Equals to' },
  { id: CAMPAIGN_TRIGGER_CONDITION.NOT_EQUALS_TO, name: 'Not equals to' },
  { id: CAMPAIGN_TRIGGER_CONDITION.MORE_THAN, name: 'More than' },
  { id: CAMPAIGN_TRIGGER_CONDITION.LESS_THAN, name: 'Less than' },
];

const ConfigureTriggers = ({ form }: { form: UseFormReturn<RuleFormValues> }) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'triggers' });

  const triggers = form.watch('triggers');

  const addTrigger = () => {
    if (fields.length >= 5) {
      toast('Maximum 5 triggers allowed');

      return;
    }
    append({ property: '', condition: '' }, { shouldFocus: true, focusName: 'triggers.0.property' });
  };

  const removeTrigger = (index: number) => {
    const isTransactionType = triggers[index]?.property === CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE;

    if (isTransactionType) {
      toast('Cannot remove transaction type trigger');

      return;
    }

    remove(index);
  };

  const getAvailableProperties = (currentIndex: number) => {
    const usedProperties = triggers.map((t, i) => (i !== currentIndex ? t.property : null));

    return propertyOptions.filter(option => !usedProperties.includes(option.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Label>Configure triggers</Label>
          <p className="text-xs text-muted-foreground">Maximum 5 triggers allowed. Each property can be used once.</p>
        </div>
        <Button size="sm" onClick={addTrigger}>
          <PlusIcon className="mr-2" /> Add trigger
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        {fields.map((field, index) => {
          const isTransactionType = triggers[index]?.property === CAMPAIGN_TRIGGER_PROPERTY.TRANSACTION_TYPE;

          return (
            <div key={field.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Label>{String(index + 1).padStart(2, '0')}</Label>
                <FormFieldSelect
                  required
                  className="min-w-40"
                  size="sm"
                  form={form}
                  fieldName={`triggers.${index}.property`}
                  formLabel="Property"
                  options={getAvailableProperties(index)}
                  showErrorMessage={false}
                />
                <FormFieldSelect
                  required
                  className="min-w-40"
                  size="sm"
                  form={form}
                  fieldName={`triggers.${index}.condition`}
                  formLabel="Condition"
                  options={conditionOptions}
                  showErrorMessage={false}
                />
              </div>
              <Button
                size="icon-sm"
                variant="outline-destructive"
                disabled={isTransactionType}
                className={isTransactionType ? 'opacity-50' : ''}
                onClick={() => removeTrigger(index)}
              >
                <Trash2Icon size={20} />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigureTriggers;
