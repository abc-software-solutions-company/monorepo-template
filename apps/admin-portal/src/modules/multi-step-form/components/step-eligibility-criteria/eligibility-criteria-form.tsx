import { UseFormReturn, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { eligibilityCriteriaSchema } from '../../validators/eligibility-criteria.validator';
import FormFieldSelect from '../form-fields/form-field-select';
import FormFieldSelectLocation from '../form-fields/form-field-select-location';

export type EligibilityCriteriaFormValues = z.infer<typeof eligibilityCriteriaSchema>;

type EligibilityCriteriaFormProps = {
  form: UseFormReturn<EligibilityCriteriaFormValues>;
  onSubmit: (data: EligibilityCriteriaFormValues) => void;
};

const EligibilityCriteriaForm: React.FC<EligibilityCriteriaFormProps> = ({ form, onSubmit }) => {
  const { control, handleSubmit } = form;

  const campaignTargetPlatform = useWatch({ control, name: 'campaignTargetPlatform' });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid max-w-lg gap-3">
        <FormFieldSelect
          form={form}
          fieldName="campaignTargetPlatform"
          formLabel="Campaign Target Platform"
          placeholder="Select platform"
          items={[
            { id: 'YaraConnect', label: 'YaraConnect' },
            { id: 'FarmCare', label: 'FarmCare' },
          ]}
        />
        <div className="grid gap-2">
          {campaignTargetPlatform === 'YaraConnect' && (
            <FormFieldSelect
              form={form}
              fieldName="shopType"
              formLabel="Shop Type"
              placeholder="Select Shop Type"
              items={[
                { id: 'type1', label: 'Shop 1' },
                { id: 'type2', label: 'Shop 2' },
              ]}
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
  );
};

export default EligibilityCriteriaForm;
