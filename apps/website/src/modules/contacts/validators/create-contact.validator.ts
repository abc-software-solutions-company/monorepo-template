import { z } from 'zod';
import { baseValidator, stringSchema } from '@repo/shared-universal/validators/zod';

export const contactFormSchema = z.object({
  name: stringSchema({
    min: 1,
    max: 255,
    required: true,
    requiredMessage: 'validator_contact_name',
    minMessage: 'validator_minimum_n_characters_allowed',
    maxMessage: 'validator_maximum_n_characters_allowed',
  }),
  email: baseValidator.email,
  subject: stringSchema({
    min: 1,
    max: 255,
    required: true,
    requiredMessage: 'validator_contact_subject',
    minMessage: 'validator_minimum_n_characters_allowed',
    maxMessage: 'validator_maximum_n_characters_allowed',
  }),
  message: stringSchema({
    min: 1,
    max: 5000,
    required: true,
    requiredMessage: 'validator_contact_message',
    minMessage: 'validator_minimum_n_characters_allowed',
    maxMessage: 'validator_maximum_n_characters_allowed',
  }),
});
