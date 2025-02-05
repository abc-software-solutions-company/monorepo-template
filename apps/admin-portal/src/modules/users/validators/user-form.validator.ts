import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

import { USER_ROLE, USER_STATUS } from '../constants/users.constant';

const createPasswordSchema = z
  .string()
  .refine(value => value.length >= 8, {
    message: 'validator_user_password_at_least_n_character',
  })
  .refine(value => value.length <= 255, {
    message: 'validator_maximum_n_characters_allowed',
  })
  .refine(value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(value), {
    message: 'validator_password_rule',
  });

const editPasswordSchema = z
  .string()
  .refine(value => value === '' || value.length >= 8, {
    message: 'validator_user_password_at_least_n_character',
  })
  .refine(value => value === '' || value.length <= 255, {
    message: 'validator_maximum_n_characters_allowed',
  })
  .refine(value => value === '' || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(value), {
    message: 'validator_password_rule',
  });

export const userFormValidator = (isEdit: boolean) => {
  return z
    .object({
      name: baseValidator.userName,
      phoneNumber: baseValidator.phoneNumber,
      email: baseValidator.email,
      role: z.nativeEnum(USER_ROLE, { errorMap: () => ({ message: 'validator_user_role' }) }),
      status: z.nativeEnum(USER_STATUS, { errorMap: () => ({ message: 'validator_user_status' }) }),
      password: isEdit ? editPasswordSchema : createPasswordSchema,
      confirmPassword: isEdit ? editPasswordSchema : createPasswordSchema,
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'validator_password_do_not_match',
      path: ['confirmPassword'],
    });
};
