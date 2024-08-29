import { z } from 'zod';

export const sendPushNotificationValidator = z.object({
  title: z.string().min(1, 'validator_notification_title').max(255, 'validator_maximum_n_characters_allowed'),
  content: z.string().min(1, 'validator_notification_content').max(255, 'validator_maximum_n_characters_allowed'),
});
