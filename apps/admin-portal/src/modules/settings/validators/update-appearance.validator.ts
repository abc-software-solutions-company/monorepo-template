import { z } from 'zod';

export const updateAppearanceValidator = z.object({
  theme: z.enum(['light', 'dark'], { required_error: 'validator_select_theme' }),
});
