/**
 * Safely sanitizes phone numbers for tel: URIs to prevent protocol injection.
 * Only allows digits, '+', '-', '(', ')', and spaces.
 */
export function sanitizePhoneUri(phone) {
  if (!phone || typeof phone !== 'string') return null;
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return cleaned ? `tel:${cleaned}` : null;
}