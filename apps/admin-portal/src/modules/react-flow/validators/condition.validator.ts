import { z } from 'zod';

export const skuValueSchema = z.object({
  product_family: z.array(z.object({ id: z.string(), name: z.string().optional() })).min(1, 'Product Family is mandatory'),
  product_variant: z.array(z.object({ id: z.string(), name: z.string().optional() })).min(1, 'Product Variant is mandatory'),
});

export const volumeValueSchema = z.object({
  metric: z.string().min(1, 'Metric is mandatory'),
  amount: z.string().min(1, 'Amount is mandatory'),
});

export const customValueSchema = z.object({
  custom_property: z.string().min(1, 'Property name is mandatory'),
  value: z.string().min(1, 'Value is mandatory'),
});

export const factSchema = z.object({
  id: z.string().optional(),
  property: z.string().min(1, 'Property is mandatory'),
  condition: z.string().min(1, 'Condition is mandatory'),
  value: z.union([z.string().min(1), z.number(), skuValueSchema, volumeValueSchema, customValueSchema]),
  conditionType: z.enum(['and', 'or']),
});

export const subsetSchema = z.object({
  id: z.string().optional(),
  conditionType: z.enum(['and', 'or']),
  facts: z.array(factSchema).min(1, 'At least one fact is required'),
});

export const setSchema = z.object({
  id: z.string().optional(),
  conditionType: z.enum(['and', 'or']),
  subsets: z.array(subsetSchema).min(1, 'At least one subset is required'),
});

export const conditionSchema = z.object({
  sets: z.array(setSchema).min(1, 'At least one set is required'),
});
