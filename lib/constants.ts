/**
 * Panda Market - Business Rules & Application Constants
 * Single source of truth for financial rules, delivery thresholds, and product readiness.
 */

// Delivery & Shipping Rules
export const FREE_DELIVERY_THRESHOLD = 200; // EGP / SAR
export const STANDARD_DELIVERY_FEE = 20;   // EGP / SAR

// Product Readiness States
export const READINESS_STATUSES = {
  ACTIVE_SELLABLE: 'active_sellable',
  DRAFT_HIDDEN: 'draft_hidden',
  EDITORIAL_ONLY: 'editorial_only',
  REQUEST_QUOTE: 'request_quote',
} as const;

export type ReadinessStatus = typeof READINESS_STATUSES[keyof typeof READINESS_STATUSES];

// Calculate delivery fee helper (pure function used client & server side)
export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
}
