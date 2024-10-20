import { z } from 'zod';

import { campaignMechanicSchema, campaignMechanismSchema } from '../validators/campaign-mechanism.validator';

export type ProgressMechanicsValues = z.infer<typeof campaignMechanismSchema>;
export type CampaignMechanicFormValues = z.infer<typeof campaignMechanicSchema>;
