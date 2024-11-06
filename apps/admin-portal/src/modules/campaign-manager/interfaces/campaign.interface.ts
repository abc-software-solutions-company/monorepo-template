import { z } from 'zod';

import { locales } from '../constants/campaign.constant';

import { campaignStep1LocalizeSchema } from '../validators/campaign-step-1.validator';
import { campaignStep2Schema } from '../validators/campaign-step-2.validator';
import { campaignStep3Schema, progressMechanicSchema } from '../validators/campaign-step-3.validator';

const campaignStep1Schema = campaignStep1LocalizeSchema(locales);

export type CampaignStep1FormValues = z.infer<typeof campaignStep1Schema>;

export type CampaignStep2FormValues = z.infer<typeof campaignStep2Schema>;

export type CampaignStep3FormValues = z.infer<typeof campaignStep3Schema>;
export type ProgressMechanicFormValues = z.infer<typeof progressMechanicSchema>;
