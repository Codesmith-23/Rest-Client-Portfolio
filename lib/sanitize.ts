/**
 * Sanitization utilities to prevent XSS attacks
 */

/**
 * Escape HTML characters to prevent XSS
 * @param input - Raw string input
 * @returns Sanitized string with HTML entities escaped
 */
export function escapeHtml(input: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Sanitize email and message inputs
 * @param email - Email address
 * @param message - Message content
 * @returns Sanitized email and message
 */
export function sanitizeContactInput(email: string, message: string) {
  return {
    email: escapeHtml(email.trim()),
    message: escapeHtml(message.trim()),
  };
}
