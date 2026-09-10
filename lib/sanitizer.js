/**
 * Sanitize string input by stripping whitespace, control characters, and limiting length.
 * Direct port of backend/utils/sanitizer.py
 */
export function sanitizeString(value, maxLength = null) {
  if (value === null || value === undefined) {
    return "";
  }

  let sanitized = String(value);

  // Remove null bytes and control characters (matching Python: [\x00-\x1f\x7f-\x9f])
  sanitized = sanitized.replace(/[\x00-\x1f\x7f-\x9f]/g, "");
  sanitized = sanitized.trim();

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}
