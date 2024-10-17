import { z } from 'zod';

export const ruleSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is mandatory').max(50, 'Maximum length for this field is only 50 characters'),
  campaignRule: z.string().min(1, 'Campaign rule is mandatory'),
  trackerType: z.string().min(1, 'Tracker type is mandatory'),
  trackerValue: z
    .string()
    .min(1, 'Tracker value is mandatory')
    .refine(val => !isNaN(Number(val)), {
      message: 'Tracker value should be a number',
    }),
  triggers: z.array(z.object({ property: z.string().min(1, 'Property is mandatory'), condition: z.string().min(1, 'Condition is mandatory') })),
});

export const rulesSchema = z.object({
  rules: z.array(ruleSchema).min(1, 'Rule is mandatory').max(3, 'Maximum of three rules allowed'),
});

export const milestoneLevelSchema = z.object({
  goals: z.array(z.string()),
  rewardType: z.string().optional(),
  rewardId: z.string().optional(),
});

export const milestoneLevelsSchema = z.object({
  milestones: z.array(milestoneLevelSchema).max(5, 'Maximum of five milestones allowed').optional(),
});

export const campaignStep3Schema = z.object({
  campaignType: z.string().min(1, 'Campaign Type is mandatory'),
});
