/**
 * Helper utilities for locale-aware formatting across Panda Market
 */

export function formatCurrency(amount: number, language: 'ar' | 'en' = 'ar'): string {
  const formatted = amount.toFixed(2);
  if (language === 'ar') {
    return `${formatted} ج.م`;
  }
  return `${formatted} EGP`;
}

/**
 * Strips Arabic diacritics (Tashkeel) and normalizes Alef variations
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    // Remove Tashkeel
    .replace(/[\u064B-\u0652]/g, '')
    // Normalize Alef variations (أ, إ, آ -> ا)
    .replace(/[أإآ]/g, 'ا');
}
