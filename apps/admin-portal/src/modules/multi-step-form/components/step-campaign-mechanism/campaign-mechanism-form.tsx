import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import MilestoneLevelsAndRewards from './milestone-levels-and-rewards';
import ProgressMechanics from './progress-mechanism';

import { CAMPAIGN_TYPE } from '../../constants/campaign.constant';
import { campaignMechanismSchema } from '../../validators/campaign-mechanism.validator';
import FormFieldRadioBlock from '../form-fields/form-field-radio-block';

export type CampaignMechanismFormValues = z.infer<typeof campaignMechanismSchema>;

type CampaignMechanismFormProps = {
  form: UseFormReturn<CampaignMechanismFormValues>;
  onSubmit: (data: CampaignMechanismFormValues) => void;
};

const CampaignMechanismForm: React.FC<CampaignMechanismFormProps> = ({ form, onSubmit }) => {
  const { handleSubmit } = form;

  return (
    <form className="frm-campaign-mechanism" onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-lg">
        <FormFieldRadioBlock
          form={form}
          fieldName="campaignType"
          formLabel="Campaign type"
          defaultValue={CAMPAIGN_TYPE.MILESTONE}
          items={[
            { id: CAMPAIGN_TYPE.MILESTONE, label: 'Milestone' },
            { id: CAMPAIGN_TYPE.STAMP, label: 'Stamp' },
          ]}
        />
      </div>
      <ProgressMechanics form={form} />
      <MilestoneLevelsAndRewards form={form} />
    </form>
  );
};

export default CampaignMechanismForm;
