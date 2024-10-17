import { z } from 'zod';

import { conditionSchema, factSchema, setSchema, subsetSchema } from '../validators/condition.validator';

export type Fact = z.infer<typeof factSchema>;
export type Subset = z.infer<typeof subsetSchema>;
export type RuleSet = z.infer<typeof setSchema>;
export type ConditionType = 'and' | 'or';
export type ConditionFormValues = z.infer<typeof conditionSchema>;
