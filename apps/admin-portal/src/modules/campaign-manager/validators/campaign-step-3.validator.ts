import { z } from 'zod';

export const progressMechanicSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is mandatory').max(50, 'Maximum length for this field is only 50 characters'),
  campaignRule: z.string().min(1, 'Campaign rule is mandatory'),
  trackerType: z.string().min(1, 'Tracker type is mandatory'),
  trackerValue: z
    .string()
    .min(1, 'Tracker value is mandatory')
    .refine(val => !isNaN(Number(val)), {
      message: 'Tracker value should be a number',
    }),
  triggers: z.array(z.object({ property: z.string(), condition: z.string() })),
});

export const campaignStep3Schema = z.object({
  campaignType: z.string().min(1, 'Campaign Type is mandatory'),
  rules: z.array(progressMechanicSchema).min(1, 'At least one progress mechanic is mandatory').max(3, 'Maximum of three progress mechanics allowed'),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        goals: z.array(z.string()),
        rewardType: z.string().optional(),
        rewardId: z.string().optional(),
      })
    )
    .optional(),
});
