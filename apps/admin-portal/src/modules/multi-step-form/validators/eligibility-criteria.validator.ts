import { z } from 'zod';

const optionSchema = z.object({
  id: z.string().min(1, 'Location ID is required'),
  name: z.string().optional(),
  tooltip: z.string().optional(),
});

export const eligibilityCriteriaSchema = z
  .object({
    campaignTargetPlatform: z.array(optionSchema).optional(),
    shopType: z.array(optionSchema).optional(),
    userLocationLevel1: z.array(optionSchema).optional(),
    userLocationLevel2: z.array(optionSchema).optional(),
  })
  .refine(
    data => {
      if (data.campaignTargetPlatform?.[0]?.id === 'yaraconnect') {
        return data.shopType && data.shopType.length > 0;
      }

      return true;
    },
    {
      message: 'Shop Type is required when Campaign Target Platform is YaraConnect',
      path: ['shopType'],
    }
  )
  .refine(
    data => {
      if (data.campaignTargetPlatform?.[0]?.id === 'yaraconnect') {
        return data.userLocationLevel2 && data.userLocationLevel2.length > 0;
      }

      return true;
    },
    {
      message: 'User Location Level 2 is required when Campaign Target Platform is YaraConnect',
      path: ['userLocationLevel2'],
    }
  );
