import { z } from 'zod';

import { conditionSchema } from './condition.validator';

export const outcomeSchema = z.object({
  id: z.string().min(1, 'Outcome id is required'),
  points_strategy_id: z.string().min(1, 'Points are required'),
  expiry_strategy_id: z.string().min(1, 'Expiry date is required'),
});

export const ruleSchema = z.object({
  width: z.coerce.number().positive(),
  label: z
    .string()
    .min(1, 'This field is mandatory')
    .max(30, 'This field must be less than 30 characters')
    .regex(/^[^!@#$%&^]+$/, 'Special characters are not allowed'),
  conditions: conditionSchema.optional(),
  rule_outcomes: outcomeSchema.optional(),
  metadata: z
    .object({
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      parent_node_id: z.string().optional(),
      ruleset_id: z.string().optional(),
      level: z.number().optional(),
    })
    .optional(),
});

export const ruleSetSchema = z
  .object({
    width: z.number().positive(),
    label: z
      .string()
      .min(1, 'This field is mandatory')
      .max(30, 'This field must be less than 30 characters')
      .regex(/^[^!@#$%&^]+$/, 'Special characters are not allowed'),
    max_points_overall: z.string().nullable().optional(),
    max_points_per_user: z.string().nullable().optional(),
    tracker_type: z.string().min(1, 'Tracker type is mandatory'),
    tracker_entity: z.string().optional(),
    action_ids: z.array(z.object({ id: z.string(), name: z.string().optional() })).min(1),
    date_type: z.enum(['no_limit', 'specific_date']),
    date_range: z
      .object({
        from: z.date({ required_error: 'Missing start date' }),
        to: z.date({ required_error: 'Missing end date' }),
      })
      .optional(),
  })
  .refine(
    data => {
      if (!data.max_points_overall || !data.max_points_per_user) return true;

      const overall = Number(data.max_points_overall);
      const perUser = Number(data.max_points_per_user);

      if (isNaN(overall) || isNaN(perUser)) return false;

      return overall > perUser;
    },
    {
      message: 'Max points overall must be greater than max points per user',
      path: ['max_points_overall'],
    }
  )
  .refine(
    data => {
      if (data.tracker_type !== 'PRORATED') return true;

      return data.tracker_entity !== undefined;
    },
    {
      message: 'Tracker entity required for PRORATED type',
      path: ['tracker_entity'],
    }
  )
  .refine(
    data => {
      if (data.date_type !== 'specific_date') return true;

      return data.date_range !== undefined;
    },
    {
      message: 'Date range required for specific date',
      path: ['date_range'],
    }
  );
