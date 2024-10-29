import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FormFieldSelect from '@/components/form-fields-ahua/form-field-select';
import FormFieldSelectTag from '@/components/form-fields-ahua/form-field-select-tag';

import { EligibilityCriteriaFormValues } from '../../interfaces/campaign.interface';

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
          <FormFieldSelectTag
            form={form}
            options={[
              { id: 'yaraconnect', name: 'YaraConnect' },
              { id: 'farmcare', name: 'FarmCare' },
            ]}
            fieldName="campaignTargetPlatform"
            formLabel="Campaign platform"
            placeholder="Select platform"
            displayField="name"
            valueField="id"
            required={true}
          />
          <div className="grid gap-2">
            {campaignTargetPlatform?.[0]?.id === 'yaraconnect' && (
              <FormFieldSelect
                form={form}
                options={[
                  { id: 'type1', name: 'Shop 1' },
                  { id: 'type2', name: 'Shop 2' },
                ]}
                fieldName="shopType"
                formLabel="Shop type"
                placeholder="Select shop"
                displayField="name"
                valueField="id"
                required={true}
              />
            )}
          </div>
          <FormFieldSelect
            form={form}
            fieldName="userLocationLevel1"
            formLabel="Select Location Level 1"
            options={[{ id: 'location1', name: 'Location 1' }]}
            placeholder="All"
            valueField="id"
            displayField="name"
            showSelectedTags={true}
          />
          {campaignTargetPlatform?.[0]?.id === 'yaraconnect' && (
            <FormFieldSelect
              form={form}
              fieldName="userLocationLevel2"
              formLabel="Select Location Level 2"
              options={[{ id: 'location1', name: 'Location 1' }]}
              placeholder="All"
              valueField="id"
              displayField="name"
              showSelectedTags={true}
            />
          )}
        </div>
        <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
      </form>
    </Form>
  );
};

export default EligibilityCriteriaForm;
