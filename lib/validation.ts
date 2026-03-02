import { z } from 'zod';
import { PAYMENT_RECEIVERS, SERVICE_FIELDS } from '@/lib/constants';

export const reportSchema = z.object({
  contractorName: z.string().min(1),
  date: z.string().min(1),
  orderNumber: z.string().min(1),
  paidByCustomer: z.coerce.number().nonnegative(),
  paymentReceiver: z.enum(PAYMENT_RECEIVERS as [string, ...string[]]),
  distanceMiles: z.coerce.number().int().nonnegative(),
  addons: z.boolean(),
  techsQuantity: z.coerce.number().int().min(1).max(2),
  extraWork: z.coerce.number().nonnegative().default(0),
  extraMaterial: z.coerce.number().nonnegative().default(0),
  tolls: z.coerce.number().nonnegative().default(0),
  tips: z.coerce.number().nonnegative().default(0),
  comments: z.string().optional(),
  messageFlag: z.boolean().default(false),
  materials: z.array(z.object({ materialId: z.number(), qty: z.number().int().min(0).max(9) })).default([]),
  media: z.array(z.object({ kind: z.enum(['payment', 'media']), filename: z.string(), mimetype: z.string(), size: z.number().int().nonnegative() })).default([]),
  services: z.object(Object.fromEntries(SERVICE_FIELDS.map((f) => [f, z.coerce.number().int().min(0)])) as Record<string, z.ZodTypeAny>)
});
