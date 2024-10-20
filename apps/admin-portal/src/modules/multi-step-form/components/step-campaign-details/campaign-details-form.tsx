import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { campaignDetailsSchema } from '../../validators/campaign-details.validator';
import FormFieldInput from '../form-fields/form-field-input';

export type CampaignDetailsFormValues = z.infer<typeof campaignDetailsSchema>;

type CampaignDetailsFormProps = {
  form: UseFormReturn<CampaignDetailsFormValues>;
  onSubmit: (data: CampaignDetailsFormValues) => void;
};

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({ form, onSubmit }) => {
  const { handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid max-w-lg gap-3">
        <FormFieldInput form={form} fieldName="name" formLabel="Campaign name" placeholder="Type something" />
        <FormFieldInput form={form} fieldName="description" formLabel="Campaign description" placeholder="Type something" />
      </div>
    </form>
  );
};

export default CampaignDetailsForm;
