export const CURRENCIES = ["USD", "EUR", "GBP", "CAD"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const PAYOUT_METHODS = ["bank_transfer", "stripe", "paypal", "other"] as const;
