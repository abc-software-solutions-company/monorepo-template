import { z } from 'zod';

export const eligibilityCriteriaSchema = z
  .object({
    campaignTargetPlatform: z.string().min(1, 'Campaign Target Platform is required'),
    shopType: z.string().optional(),
    userLocationLevel1: z.string().min(1, 'User Location Level 1 is required'),
    userLocationLevel2: z.string().optional(),
  })
  .refine(
    data => {
      if (data.campaignTargetPlatform === 'YaraConnect') {
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
      if (data.campaignTargetPlatform === 'YaraConnect') {
        return data.userLocationLevel2 && data.userLocationLevel2.length > 0;
      }

      return true;
    },
    {
      message: 'User Location Level 2 is required when Campaign Target Platform is YaraConnect',
      path: ['userLocationLevel2'],
    }
  );
