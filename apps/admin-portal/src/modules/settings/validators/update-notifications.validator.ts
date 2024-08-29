import { z } from 'zod';

export const updateNotificationsValidator = z.object({
  emailMarketing: z.boolean().default(true).optional(),
  emailSocial: z.boolean().default(true).optional(),
});
