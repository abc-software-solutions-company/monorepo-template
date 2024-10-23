import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import { EligibilityCriteriaFormValues } from '../../interfaces/campaign.interface';
import FormFieldSelect from '../form-fields/form-field-select';
import FormFieldSelectLocation from '../form-fields/form-field-select-location';

type EligibilityCriteriaFormProps = {
  form: UseFormReturn<EligibilityCriteriaFormValues>;
  onSubmit: (data: EligibilityCriteriaFormValues) => void;
};

const EligibilityCriteriaForm: React.FC<EligibilityCriteriaFormProps> = ({ form, onSubmit }) => {
  const campaignTargetPlatform = form.watch('campaignTargetPlatform');

  return (
    <Form {...form}>
      <form className="frm-eligibility-criteria" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-lg gap-3">
          <FormFieldSelect
            disabled
            form={form}
            options={[
              { id: 'YaraConnect', label: 'YaraConnect' },
              { id: 'FarmCare', label: 'FarmCare' },
            ]}
            fieldName="campaignTargetPlatform"
            formLabel="Product variant"
            placeholder="Select product"
            displayField="label"
            valueField="id"
            size="sm"
            required={true}
          />
          <div className="grid gap-2">
            {campaignTargetPlatform === 'YaraConnect' && (
              <FormFieldSelect
                disabled
                form={form}
                options={[
                  { id: 'type1', label: 'Shop 1' },
                  { id: 'type2', label: 'Shop 2' },
                ]}
                fieldName="campaignTargetPlatform"
                formLabel="Product variant"
                placeholder="Select product"
                displayField="label"
                valueField="id"
                size="sm"
                required={true}
              />
            )}
          </div>
          <FormFieldSelectLocation
            form={form}
            fieldName="userLocationLevel1"
            formLabel="Select Location Level 1"
            items={[{ id: 'location1', label: 'Location 1' }]}
          />
          {campaignTargetPlatform === 'YaraConnect' && (
            <FormFieldSelectLocation
              form={form}
              fieldName="userLocationLevel2"
              formLabel="Select Location Level 2"
              items={[{ id: 'location1', label: 'Location 1' }]}
            />
          )}
        </div>
      </form>
    </Form>
  );
};

export default EligibilityCriteriaForm;
