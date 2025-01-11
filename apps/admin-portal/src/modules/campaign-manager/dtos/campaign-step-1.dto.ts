import { Translation } from '@repo/shared-universal/interfaces/language.interface';
import { setUTCEndOfDay, setUTCStartOfDay } from '@repo/shared-universal/utils/date.util';

import { CampaignStep1FormValues } from '../interfaces/campaign.interface';

export type CampaignStep1Payload = {
  name: string;
  name_localized: Translation[];
  description: string;
  description_localized: Translation[];
  tnc: string;
  tnc_localized: Translation[];
  image_url: string;
  image_url_localized: Translation[];
  start_date: Date;
  end_date: Date;
};

export const campaignStep1Dto = (formValues: CampaignStep1FormValues): Partial<CampaignStep1Payload> => {
  const { name, description, tnc, imageUrl, startDate, endDate } = formValues;

  const adjustedStartDate = setUTCStartOfDay(startDate ?? new Date());
  const adjustedEndDate = setUTCEndOfDay(endDate ?? new Date());

  return {
    name: name?.[0]?.value ?? '',
    name_localized: name,
    description: description?.[0]?.value ?? '',
    description_localized: description,
    tnc: tnc?.[0]?.value ?? '',
    tnc_localized: tnc,
    image_url: imageUrl?.[0]?.value ?? '',
    image_url_localized: imageUrl,
    start_date: adjustedStartDate,
    end_date: adjustedEndDate,
  };
};
