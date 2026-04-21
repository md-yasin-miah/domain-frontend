export const CURRENCIES = ["USD", "EUR", "GBP", "CAD"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const PAYOUT_METHODS = [
  "bank_transfer",
  "stripe",
  "paypal",
  "other",
] as const;
export const FALLBACK_IMAGE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f3f4f6'/>
        <stop offset='100%' stop-color='#e5e7eb'/>
      </linearGradient>
    </defs>
    <rect width='800' height='400' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial, sans-serif' font-size='28'>
      No Image Available
    </text>
  </svg>`,
  );
