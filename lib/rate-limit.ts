/**
 * Rate Limiting Utility using Token Bucket Algorithm
 * Limits: 3 requests per 60 seconds per IP
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_TOKENS = 3;
const REFILL_RATE = 60000; // 60 seconds in milliseconds
const TOKENS_PER_REFILL = 3;

/**
 * Check if the IP address has exceeded rate limit
 * @param ip - Client IP address
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // First request from this IP
    rateLimitStore.set(ip, {
      tokens: MAX_TOKENS - 1,
      lastRefill: now,
    });
    return true;
  }

  // Calculate time elapsed since last refill
  const timeSinceLastRefill = now - entry.lastRefill;
  const refillIntervals = Math.floor(timeSinceLastRefill / REFILL_RATE);

  // Refill tokens if enough time has passed
  if (refillIntervals > 0) {
    entry.tokens = Math.min(
      MAX_TOKENS,
      entry.tokens + refillIntervals * TOKENS_PER_REFILL
    );
    entry.lastRefill = now;
  }

  // Check if tokens are available
  if (entry.tokens > 0) {
    entry.tokens -= 1;
    rateLimitStore.set(ip, entry);
    return true;
  }

  // Rate limit exceeded
  return false;
}

/**
 * Clean up old entries (optional, run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const expirationTime = 5 * 60 * 1000; // 5 minutes

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.lastRefill > expirationTime && entry.tokens === MAX_TOKENS) {
      rateLimitStore.delete(ip);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
