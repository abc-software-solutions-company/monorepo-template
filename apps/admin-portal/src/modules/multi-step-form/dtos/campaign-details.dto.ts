import { TranslationValue } from '@/interfaces/language.interface';
import { CampaignDetailsFormValues } from '../interfaces/campaign.interface';

import { setEndOfDay, setStartOfDay } from '@/utils/date.util';

type CreateCampaignVariables = {
  name: string;
  campaign_name: TranslationValue[];
  start_date: Date;
  end_date: Date;
};

export const campaignDetailsDto = (formValues: CampaignDetailsFormValues): CreateCampaignVariables => {
  const { name, startDate, endDate } = formValues;

  const adjustedStartDate = setStartOfDay(startDate ?? new Date());
  const adjustedEndDate = setEndOfDay(endDate ?? new Date());

  return {
    name: name?.[0]?.value ?? '',
    campaign_name: name,
    start_date: adjustedStartDate,
    end_date: adjustedEndDate,
  };
};
