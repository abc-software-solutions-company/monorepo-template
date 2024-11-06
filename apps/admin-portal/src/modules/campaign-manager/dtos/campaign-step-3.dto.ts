import { CampaignStep3FormValues } from '../interfaces/campaign.interface';

export type CampaignStep3Payload = {
  campaign_type: string;
};

export const campaignStep3Dto = (formValues: CampaignStep3FormValues): Partial<CampaignStep3Payload> => {
  const { campaignType } = formValues;

  return {
    campaign_type: campaignType,
  };
};
