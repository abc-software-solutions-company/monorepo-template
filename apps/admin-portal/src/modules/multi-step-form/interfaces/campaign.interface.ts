import { z } from 'zod';

import { campaignDetailsSchema } from '../validators/campaign-details.validator';
import {
  campaignMechanismSchema,
  configureProgressMechanicsSchema,
  milestoneLevelsAndRewardsSchema,
} from '../validators/campaign-mechanism.validator';
import { eligibilityCriteriaSchema } from '../validators/eligibility-criteria.validator';

export type CampaignDetailsFormValues = z.infer<typeof campaignDetailsSchema>;
export type EligibilityCriteriaFormValues = z.infer<typeof eligibilityCriteriaSchema>;
export type CampaignMechanismFormValues = z.infer<typeof campaignMechanismSchema>;

export type ConfigureProgressMechanicsFormValues = z.infer<typeof configureProgressMechanicsSchema>;
export type MilestoneLevelsAndRewardsFormValues = z.infer<typeof milestoneLevelsAndRewardsSchema>;
