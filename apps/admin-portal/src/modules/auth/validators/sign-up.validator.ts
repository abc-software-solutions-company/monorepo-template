import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

export const signUpValidator = z
  .object({
    name: baseValidator.userName,
    phoneNumber: baseValidator.phoneNumber,
    email: baseValidator.email,
    password: baseValidator.password,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validator_password_dont_match',
    path: ['confirmPassword'],
  });
