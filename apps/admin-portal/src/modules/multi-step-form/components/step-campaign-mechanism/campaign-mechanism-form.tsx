import { UseFormReturn } from 'react-hook-form';
import { Form, FormLabel } from '~react-web-ui-shadcn/components/ui/form';
import { Label } from '~react-web-ui-shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~react-web-ui-shadcn/components/ui/radio-group';

import MilestoneLevelsAndRewards from './milestone-levels-and-rewards';
import ProgressMechanics from './progress-mechanism';

import { CAMPAIGN_TYPE } from '../../constants/campaign.constant';
import { CampaignMechanismFormValues } from '../../interfaces/campaign.interface';

type CampaignMechanismFormProps = {
  form: UseFormReturn<CampaignMechanismFormValues>;
  onSubmit: (data: CampaignMechanismFormValues) => void;
};

const CampaignMechanismForm: React.FC<CampaignMechanismFormProps> = ({ form, onSubmit }) => {
  const campaignType = form.watch('campaignType');

  return (
    <>
      <Form {...form}>
        <form className="frm-campaign-mechanism" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-lg">
            <FormLabel>Campaign type</FormLabel>
            <RadioGroup defaultValue={campaignType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={CAMPAIGN_TYPE.MILESTONE} id="option-one" />
                <Label htmlFor="option-one">Milestone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={CAMPAIGN_TYPE.STAMP} id="option-two" />
                <Label htmlFor="option-two">Stamp</Label>
              </div>
            </RadioGroup>
          </div>
          <ProgressMechanics form={form} />
          <MilestoneLevelsAndRewards form={form} />
        </form>
      </Form>
    </>
  );
};

export default CampaignMechanismForm;
