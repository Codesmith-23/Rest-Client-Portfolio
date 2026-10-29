import { kv } from '@vercel/kv';

/**
 * Fixed-window rate limit backed by Vercel KV, so the count is shared by
 * every serverless instance and survives cold starts.
 *
 * Returns true if the request is allowed. If KV is unreachable (for example
 * locally without KV env vars) it allows the request rather than breaking the feature.
 */
export async function checkKvRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const windowId = Math.floor(Date.now() / 1000 / windowSeconds);
  const bucket = `ratelimit:${key}:${windowId}`;

  try {
    const count = await kv.incr(bucket);
    if (count === 1) {
      await kv.expire(bucket, windowSeconds);
    }
    return count <= limit;
  } catch (error) {
    console.error('KV rate limit error:', error);
    return true;
  }
}

/** Best-effort client IP from Vercel's forwarding headers */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}