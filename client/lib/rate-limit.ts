/**
 * In-memory rate limiter for serverless API routes.
 * Uses a sliding-window counter per IP.
 *
 * NOTE: Each Vercel serverless instance has its own memory, so this
 * is "best-effort" — it stops casual abuse without needing Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 60s to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  ip: string,
  opts: RateLimitOptions = { limit: 5, windowSeconds: 60 },
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = `${ip}`;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + opts.windowSeconds * 1000 });
    return {
      success: true,
      limit: opts.limit,
      remaining: opts.limit - 1,
      reset: now + opts.windowSeconds * 1000,
    };
  }

  entry.count++;

  if (entry.count > opts.limit) {
    return {
      success: false,
      limit: opts.limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  return {
    success: true,
    limit: opts.limit,
    remaining: opts.limit - entry.count,
    reset: entry.resetAt,
  };
}

/**
 * Extract client IP from a Next.js request.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
