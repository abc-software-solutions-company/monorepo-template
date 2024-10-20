import { z } from 'zod';

const propertyEnum = z.enum(['transaction_type', 'amount', 'sku', 'quantity', 'custom']);

export const campaignMechanicTriggerSchema = z
  .object({
    property: z.union([z.literal(''), propertyEnum]),
    condition: z.string().min(1, 'Condition is required'),
  })
  .and(
    z.discriminatedUnion('property', [
      z.object({
        property: z.literal('transaction_type'),
        field: z.string().min(1, 'Field is required'),
      }),
      z.object({
        property: z.literal('amount'),
        amount: z.number({ required_error: 'Amount is required' }),
      }),
      z.object({
        property: z.literal('sku'),
        sku: z.object({
          productFamily: z.string().min(1, 'Product family is required'),
          productVariant: z.string().min(1, 'Product variant is required'),
        }),
      }),
      z.object({
        property: z.literal('quantity'),
        quantity: z.number({ required_error: 'Quantity is required' }),
      }),
      z.object({
        property: z.literal('custom'),
        custom: z.string().min(1, 'Custom value is required'),
      }),
      z.object({
        property: z.literal(''),
      }),
    ])
  );
export const campaignMechanicSchema = z.object({
  name: z.string().min(1, 'name is required'),
  campaignRule: z.string().min(1, 'campaignRule is required'),
  triggers: z.array(campaignMechanicTriggerSchema),
});

export const campaignMechanismSchema = z.object({
  campaignType: z.string().min(1, 'campaignType is required'),
  progressMechanics: z
    .array(campaignMechanicSchema)
    .min(1, 'At least one progress mechanic is required')
    .max(3, 'Maximum of three progress mechanics allowed'),
});
