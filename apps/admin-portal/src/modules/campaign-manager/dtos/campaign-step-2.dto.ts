import { CampaignStep2FormValues } from '../interfaces/campaign.interface';

export type CampaignStep2Payload = {
  nation: string;
  country: { id: string }[];
  keyword: string;
};

export const campaignStep2Dto = (formValues: CampaignStep2FormValues): Partial<CampaignStep2Payload> => {
  const { nation, country, keyword } = formValues;

  const c = country.map(item => ({ id: item.id }));

  return {
    nation,
    country: c,
    keyword,
  };
};
