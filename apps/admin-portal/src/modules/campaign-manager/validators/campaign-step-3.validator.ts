import { z } from 'zod';

export const campaignStep3Schema = z.object({
  campaignType: z.string().min(1, 'Campaign Type is madatory'),
  progressMechanics: z
    .array(
      z.object({
        ruleName: z.string().min(1, 'Rule name is required'),
        campaignRule: z.string().min(1, 'Campaign rule is required'),
        triggers: z.array(
          z.object({
            property: z.array(z.object({ id: z.string() })).optional(),
            condition: z.array(z.object({ id: z.string() })).optional(),
          })
        ),
      })
    )
    .min(1, 'At least one progress mechanic is required')
    .max(3, 'Maximum of three progress mechanics allowed'),
});
