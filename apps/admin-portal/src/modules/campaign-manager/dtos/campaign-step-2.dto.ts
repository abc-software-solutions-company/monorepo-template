import { CampaignStep2FormValues } from '../interfaces/campaign.interface';

export type CampaignStep2Payload = {
  country: { id: string; name: string }[];
  keyword: string;
};

export const campaignStep2Dto = (formValues: CampaignStep2FormValues): Partial<CampaignStep2Payload> => {
  const { country, keyword } = formValues;

  return {
    country,
    keyword,
  };
};
