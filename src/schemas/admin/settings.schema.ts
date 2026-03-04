import { z } from "zod";

const commissionTypeEnum = z.enum(["percentage", "fixed"]);

export const settingsFormSchema = z.object({
  site_name: z.string().optional(),
  site_logo_url: z.string().optional().refine((v) => !v || v === "" || /^https?:\/\/[^\s]+$/.test(v), "Invalid URL"),
  site_description: z.string().optional(),
  default_currency: z.string().min(1, "Currency is required").default("USD"),
  support_email: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email"),
  buyer_commission_percent: z.coerce.number().min(0, "Must be ≥ 0").max(100, "Must be ≤ 100"),
  seller_commission_percent: z.coerce.number().min(0, "Must be ≥ 0").max(100, "Must be ≤ 100"),
  buyer_commission_type: commissionTypeEnum.default("percentage"),
  seller_commission_type: commissionTypeEnum.default("percentage"),
  buyer_commission_fixed: z.coerce.number().min(0, "Must be ≥ 0"),
  seller_commission_fixed: z.coerce.number().min(0, "Must be ≥ 0"),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;
