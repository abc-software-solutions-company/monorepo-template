import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { campaignStep1LocalizeSchema } from '../validators/campaign-step-1.validator';
import { campaignStep2Schema } from '../validators/campaign-step-2.validator';
import { campaignStep3Schema, milestoneLevelSchema, milestoneLevelsSchema, ruleSchema, rulesSchema } from '../validators/campaign-step-3.validator';

const campaignStep1Schema = campaignStep1LocalizeSchema(LANGUAGES);

export type CampaignStep1FormValues = z.infer<typeof campaignStep1Schema>;

export type CampaignStep2FormValues = z.infer<typeof campaignStep2Schema>;

export type CampaignStep3FormValues = z.infer<typeof campaignStep3Schema>;
export type RuleFormValues = z.infer<typeof ruleSchema>;
export type RulesFormValues = z.infer<typeof rulesSchema>;
export type MilestoneFormValues = z.infer<typeof milestoneLevelSchema>;
export type MilestonesFormValues = z.infer<typeof milestoneLevelsSchema>;
